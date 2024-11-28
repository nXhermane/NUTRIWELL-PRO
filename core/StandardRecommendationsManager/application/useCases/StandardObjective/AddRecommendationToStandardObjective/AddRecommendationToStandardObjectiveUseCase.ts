import { AggregateID, AppError, left, NeedsRecommendationDto, NeedsRecommendationFactory, Result, right, UseCase } from "@/core/shared";
import { AddRecommendationToStandardObjectiveRequest } from "./AddRecommendationToStandardObjectiveRequest";
import { AddRecommendationToStandardObjectiveResponse } from "./AddRecommendationToStandardObjectiveResponse";
import { StandardObjectiveRepository } from "@/core/StandardRecommendationsManager/infrastructure";
import { AddRecommendationToStandardObjectiveErrors } from "./AddRecommendationToStandardObjectiveErrors";
import { StandardObjective } from "@/core/StandardRecommendationsManager/domain";

export class AddRecommendationToStandardObjectiveUseCase
   implements UseCase<AddRecommendationToStandardObjectiveRequest, AddRecommendationToStandardObjectiveResponse>
{
   constructor(private repo: StandardObjectiveRepository) {}
   async execute(request: AddRecommendationToStandardObjectiveRequest): Promise<AddRecommendationToStandardObjectiveResponse> {
      try {
         const objective = await this.getStandardObjective(request.standardObjectiveId);
         this.addNeedsRecommendationToStandardObjective(objective, request.recommendations);
         this.saveStandardObjective(objective);
         return right(Result.ok<void>());
      } catch (error) {
         if (
            error instanceof AddRecommendationToStandardObjectiveErrors.NeedsRecommendationCreationFailed ||
            error instanceof AddRecommendationToStandardObjectiveErrors.StandardObjectiveNotFoundError ||
            error instanceof AddRecommendationToStandardObjectiveErrors.StandardObjectiveValidationError ||
            error instanceof AddRecommendationToStandardObjectiveErrors.StandardObjectiveRepoError
         )
            return left(error);
         else return left(new AppError.UnexpectedError(error));
      }
   }
   private addNeedsRecommendationToStandardObjective(objective: StandardObjective, recommendations: NeedsRecommendationDto[]) {
      try {
         const recommendationResult = recommendations.map((recommendation) => NeedsRecommendationFactory.create(recommendation));
         const recommendationResultCombine = Result.combine(recommendationResult);
         if (recommendationResultCombine.isFailure)
            throw new AddRecommendationToStandardObjectiveErrors.NeedsRecommendationCreationFailed(recommendationResultCombine.err);
         objective.addRecommendations(...recommendationResult.map((recommendationRes) => recommendationRes.val));
      } catch (error) {
         throw new AddRecommendationToStandardObjectiveErrors.StandardObjectiveValidationError(error);
      }
   }
   private async getStandardObjective(objectiveId: AggregateID): Promise<StandardObjective> {
      try {
         const objective = await this.repo.getById(objectiveId);
         return objective;
      } catch (error) {
         throw new AddRecommendationToStandardObjectiveErrors.StandardObjectiveNotFoundError(error, objectiveId);
      }
   }
   private async saveStandardObjective(objective: StandardObjective) {
      try {
         await this.repo.save(objective);
      } catch (err: any) {
         throw new AddRecommendationToStandardObjectiveErrors.StandardObjectiveRepoError(err);
      }
   }
}
