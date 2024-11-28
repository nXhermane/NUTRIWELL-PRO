import { AggregateID, AppError, HealthIndicator, IHealthIndicator, left, Result, right, UseCase } from "@/core/shared";
import { RemoveHealthIndicatorFromStandardMedicalConditionErrors } from "./RemoveHealthIndicatorFromStandardMedicalConditionErrors";
import { RemoveHealthIndicatorFromStandardMedicalConditionRequest } from "./RemoveHealthIndicatorFromStandardMedicalConditionRequest";
import { RemoveHealthIndicatorFromStandardMedicalConditionResponse } from "./RemoveHealthIndicatorFromStandardMedicalConditionResponse";
import { StandardMedicalCondition } from "@/core/StandardRecommendationsManager/domain";
import { StandardMedicalConditionRepository } from "@/core/StandardRecommendationsManager/infrastructure";

export class RemoveHealthIndicatorFromStandardMedicalConditionUseCase
   implements UseCase<RemoveHealthIndicatorFromStandardMedicalConditionRequest, RemoveHealthIndicatorFromStandardMedicalConditionResponse>
{
   constructor(private repo: StandardMedicalConditionRepository) {}
   async execute(
      request: RemoveHealthIndicatorFromStandardMedicalConditionRequest,
   ): Promise<RemoveHealthIndicatorFromStandardMedicalConditionResponse> {
      try {
         const medicalCondition = await this.getStandardMedicalCondition(request.standardMedicalConditionId);
         this.removeHealthIndicatorsFromStandardMedicalCondition(medicalCondition, request.healthIndicators);
         await this.saveStandardMedicalCondition(medicalCondition);
         return right(Result.ok<boolean>(true));
      } catch (error) {
         if (
            error instanceof RemoveHealthIndicatorFromStandardMedicalConditionErrors.HealthIndicatorCreationFailed ||
            error instanceof RemoveHealthIndicatorFromStandardMedicalConditionErrors.StandardMedicalConditionRepoError ||
            error instanceof RemoveHealthIndicatorFromStandardMedicalConditionErrors.StandardMedicalConditionValidationError ||
            error instanceof RemoveHealthIndicatorFromStandardMedicalConditionErrors.StandardMedicalConditionnNotFoundError
         )
            return left(error);
         else return left(new AppError.UnexpectedError(error));
      }
   }

   private removeHealthIndicatorsFromStandardMedicalCondition(medicalCondition: StandardMedicalCondition, healthIndicatords: IHealthIndicator[]) {
      const removedHealthIndicatorsResults = healthIndicatords.map((healthIndicator) => HealthIndicator.create(healthIndicator));
      const removedHealthIndicatorResultsCombine = Result.combine(removedHealthIndicatorsResults);
      if (removedHealthIndicatorResultsCombine.isFailure)
         throw new RemoveHealthIndicatorFromStandardMedicalConditionErrors.HealthIndicatorCreationFailed(removedHealthIndicatorResultsCombine.err);
      const removedHealthIndicators = removedHealthIndicatorsResults.map((healthIndicatorResult) => healthIndicatorResult.val);
      medicalCondition.addHealthIndicator(...removedHealthIndicators);
   }
   private async getStandardMedicalCondition(medicalConditionId: AggregateID): Promise<StandardMedicalCondition> {
      try {
         const medicalCondition = await this.repo.getById(medicalConditionId);
         return medicalCondition;
      } catch (error) {
         throw new RemoveHealthIndicatorFromStandardMedicalConditionErrors.StandardMedicalConditionnNotFoundError(error, medicalConditionId);
      }
   }
   private async saveStandardMedicalCondition(medicalCondition: StandardMedicalCondition) {
      try {
         await this.repo.save(medicalCondition);
      } catch (err: any) {
         throw new RemoveHealthIndicatorFromStandardMedicalConditionErrors.StandardMedicalConditionRepoError(err);
      }
   }
}
