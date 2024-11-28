import { AggregateID, AppError, left, NeedsRecommendationDto, NeedsRecommendationFactory, Result, right, UseCase } from "@/core/shared";
import { RemoveRecommendationFromStandardMedicalConditionRequest } from "./RemoveRecommendationFromStandardMedicalConditionRequest";
import { RemoveRecommendationFromStandardMedicalConditionResponse } from "./RemoveRecommendationFromStandardMedicalConditionResponse";
import { StandardMedicalConditionRepository } from "@/core/StandardRecommendationsManager/infrastructure";
import { RemoveRecommendationFromStandardMedicalConditionErrors } from "./RemoveRecommendationFromStandardMedicalConditionErrors";
import { StandardMedicalCondition } from "@/core/StandardRecommendationsManager/domain";
import { RemoveRecommendationFromStandardObjectiveErrors } from "../../StandardObjective/RemoveRecommendationFromStandardObjective";

export class RemoveRecommendationFromStandardMedicalConditionUseCase
   implements UseCase<RemoveRecommendationFromStandardMedicalConditionRequest, RemoveRecommendationFromStandardMedicalConditionResponse>
{
   constructor(private repo: StandardMedicalConditionRepository) {}
   async execute(
      request: RemoveRecommendationFromStandardMedicalConditionRequest,
   ): Promise<RemoveRecommendationFromStandardMedicalConditionResponse> {
      try {
         const medicalCondition = await this.getStandardMedicalCondition(request.standardMedicalConditionId);
         this.removeRecommendationsFromStandardMedicalCondition(medicalCondition, request.recommendations);
         await this.saveStandardObjective(medicalCondition);
         return right(Result.ok<boolean>(true));
      } catch (error) {
         if (
            error instanceof RemoveRecommendationFromStandardObjectiveErrors.NeedsRecommendationCreationFailed ||
            error instanceof RemoveRecommendationFromStandardMedicalConditionErrors.StandardMedicalConditionRepoError ||
            error instanceof RemoveRecommendationFromStandardMedicalConditionErrors.StandardMedicalConditionValidationError ||
            error instanceof RemoveRecommendationFromStandardMedicalConditionErrors.StandardMedicalConditionnNotFoundError
         )
            return left(error);
         else return left(new AppError.UnexpectedError(error));
      }
   }
   private removeRecommendationsFromStandardMedicalCondition(medicalCondition: StandardMedicalCondition, recommendations: NeedsRecommendationDto[]) {
      const removedRecommendationResults = recommendations.map((recommendation) => NeedsRecommendationFactory.create(recommendation));
      const removedRecommendationResultsCombine = Result.combine(removedRecommendationResults);
      if (removedRecommendationResultsCombine.isFailure)
         throw new RemoveRecommendationFromStandardMedicalConditionErrors.NeedsRecommendationCreationFailed(removedRecommendationResultsCombine.err);
      const removedRecommendations = removedRecommendationResults.map((recommendationResult) => recommendationResult.val);
      medicalCondition.removeRecommendation(...removedRecommendations);
   }
   private async getStandardMedicalCondition(medicalConditionId: AggregateID): Promise<StandardMedicalCondition> {
      try {
         const medicalCondition = await this.repo.getById(medicalConditionId);
         return medicalCondition;
      } catch (error) {
         throw new RemoveRecommendationFromStandardMedicalConditionErrors.StandardMedicalConditionnNotFoundError(error, medicalConditionId);
      }
   }
   private async saveStandardObjective(medicalCondition: StandardMedicalCondition) {
      try {
         await this.repo.save(medicalCondition);
      } catch (err: any) {
         throw new RemoveRecommendationFromStandardMedicalConditionErrors.StandardMedicalConditionRepoError(err);
      }
   }
}
