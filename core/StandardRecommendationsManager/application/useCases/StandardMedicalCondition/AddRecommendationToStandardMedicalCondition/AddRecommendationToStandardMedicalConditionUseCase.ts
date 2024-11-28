import { AggregateID, AppError, left, NeedsRecommendationDto, NeedsRecommendationFactory, Result, right, UseCase } from "@/core/shared";
import { AddRecommendationToStandardMedicalConditionRequest } from "./AddRecommendationToStandardMedicalConditionRequest";
import { AddRecommendationToStandardMedicalConditionResponse } from "./AddRecommendationToStandardMedicalConditionResponse";
import { StandardMedicalConditionRepository } from "@/core/StandardRecommendationsManager/infrastructure";
import { StandardMedicalCondition } from "@/core/StandardRecommendationsManager/domain";
import { AddRecommendationToStandardMedicalConditionErrors } from "./AddRecommendationToStandardMedicalConditionErrors";

export class AddRecommendationToStandardMedicalConditionUseCase
   implements UseCase<AddRecommendationToStandardMedicalConditionRequest, AddRecommendationToStandardMedicalConditionResponse>
{
   constructor(private repo: StandardMedicalConditionRepository) {}
   async execute(request: AddRecommendationToStandardMedicalConditionRequest): Promise<AddRecommendationToStandardMedicalConditionResponse> {
      try {
         const medicalCondition = await this.getStandardMedicalCondition(request.standardMedicalConditionId);
         this.addNeedsRecommendationToStandardMedicalCondition(medicalCondition, request.recommendations);
         await this.saveStandardObjective(medicalCondition);
         return right(Result.ok<void>());
      } catch (error) {
         if (
            error instanceof AddRecommendationToStandardMedicalConditionErrors.NeedsRecommendationCreationFailed ||
            error instanceof AddRecommendationToStandardMedicalConditionErrors.StandardMedicalConditionValidationError ||
            error instanceof AddRecommendationToStandardMedicalConditionErrors.StandardMedicalConditionRepoError
         )
            return left(error);
         else return left(new AppError.UnexpectedError(error));
      }
   }

   private addNeedsRecommendationToStandardMedicalCondition(medicalCondition: StandardMedicalCondition, recommendations: NeedsRecommendationDto[]) {
      try {
         const recommendationResult = recommendations.map((recommendation) => NeedsRecommendationFactory.create(recommendation));
         const recommendationResultCombine = Result.combine(recommendationResult);
         if (recommendationResultCombine.isFailure)
            throw new AddRecommendationToStandardMedicalConditionErrors.NeedsRecommendationCreationFailed(recommendationResultCombine.err);
         medicalCondition.addRecommendation(...recommendationResult.map((recommendationRes) => recommendationRes.val));
      } catch (error) {
         throw new AddRecommendationToStandardMedicalConditionErrors.StandardMedicalConditionValidationError(error);
      }
   }
   private async getStandardMedicalCondition(medicalConditionId: AggregateID): Promise<StandardMedicalCondition> {
      try {
         const medicalCondition = await this.repo.getById(medicalConditionId);
         return medicalCondition;
      } catch (error) {
         throw new AddRecommendationToStandardMedicalConditionErrors.StandardMedicalConditionnNotFoundError(error, medicalConditionId);
      }
   }
   private async saveStandardObjective(medicalCondition: StandardMedicalCondition) {
      try {
         await this.repo.save(medicalCondition);
      } catch (err: any) {
         throw new AddRecommendationToStandardMedicalConditionErrors.StandardMedicalConditionRepoError(err);
      }
   }
}
