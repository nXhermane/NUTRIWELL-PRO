import { AggregateID, AppError, left, NeedsRecommendationDto, NeedsRecommendationFactory, Result, right, UseCase } from "@/core/shared";
import { RemoveRecommendationFromStandardObjectiveRequest } from "./RemoveRecommendationFromStandardObjectiveRequest";
import { RemoveRecommendationFromStandardObjectiveResponse } from "./RemoveRecommendationFromStandardObjectiveResponse";
import { RemoveRecommendationFromStandardObjectiveErrors } from "./RemoveRecommendationFromStandardObjectiveErrors";
import { StandardObjectiveRepository } from "@/core/StandardRecommendationsManager/infrastructure";
import { StandardObjective } from "@/core/StandardRecommendationsManager/domain";

export class RemoveRecommendationFromStandardObjectiveUseCase
   implements UseCase<RemoveRecommendationFromStandardObjectiveRequest, RemoveRecommendationFromStandardObjectiveResponse>
{
   constructor(private repo: StandardObjectiveRepository) {}
   async execute(request: RemoveRecommendationFromStandardObjectiveRequest): Promise<RemoveRecommendationFromStandardObjectiveResponse> {
      try {
         const objective = await this.getStandardObjective(request.standardObjectiveId);
         this.removeRecommendationsFromStandardObjective(objective, request.recommendations);
         await this.saveStandardObjective(objective);
         return right(Result.ok<boolean>(true));
      } catch (error) {
         if (
            error instanceof RemoveRecommendationFromStandardObjectiveErrors.NeedsRecommendationCreationFailed ||
            error instanceof RemoveRecommendationFromStandardObjectiveErrors.RecommendationNotFoundOnStandardObjective ||
            error instanceof RemoveRecommendationFromStandardObjectiveErrors.StandardObjectiveNotFoundError ||
            error instanceof RemoveRecommendationFromStandardObjectiveErrors.StandardObjectiveRepoError
         )
            return left(error);
         else return left(new AppError.UnexpectedError(error));
      }
   }

   private async getStandardObjective(objectiveId: AggregateID): Promise<StandardObjective> {
      try {
         const objective = await this.repo.getById(objectiveId);
         return objective;
      } catch (error) {
         throw new RemoveRecommendationFromStandardObjectiveErrors.StandardObjectiveNotFoundError(error, objectiveId);
      }
   }
   private removeRecommendationsFromStandardObjective(objective: StandardObjective, recommendations: NeedsRecommendationDto[]) {
      const removedRecommendationResults = recommendations.map((recommendation) => NeedsRecommendationFactory.create(recommendation));
      const removedRecommendationResultsCombine = Result.combine(removedRecommendationResults);
      if (removedRecommendationResultsCombine.isFailure)
         throw new RemoveRecommendationFromStandardObjectiveErrors.NeedsRecommendationCreationFailed(removedRecommendationResultsCombine.err);
      const removedRecommendations = removedRecommendationResults.map((recommendationResult) => recommendationResult.val);
      objective.removeRecommendation(...removedRecommendations);
   }
   private async saveStandardObjective(objective: StandardObjective) {
      try {
         await this.repo.save(objective);
      } catch (err: any) {
         throw new RemoveRecommendationFromStandardObjectiveErrors.StandardObjectiveRepoError(err);
      }
   }
}
