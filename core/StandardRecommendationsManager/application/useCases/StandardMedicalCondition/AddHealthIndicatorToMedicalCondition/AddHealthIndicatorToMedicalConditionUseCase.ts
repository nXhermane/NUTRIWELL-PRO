import { AggregateID, AppError, HealthIndicator, IHealthIndicator, left, Result, right, UseCase } from "@/core/shared";
import { AddHealthIndicatorToMedicalConditionRequest } from "./AddHealthIndicatorToStandardMedicalConditionRequest";
import { AddHealthIndicatorToMedicalConditionResponse } from "./AddHealthIndicatorToStandardMedicalConditionResponse";
import { AddHealthIndicatorToStandardMedicalConditionErrors } from "./AddHealthIndicatorToStandardMedicalConditionErrors";
import { StandardMedicalCondition } from "@/core/StandardRecommendationsManager/domain";
import { StandardMedicalConditionRepository } from "@/core/StandardRecommendationsManager/infrastructure";

export class AddHealthIndicatorToStandardMedicalConditionUseCase
   implements UseCase<AddHealthIndicatorToMedicalConditionRequest, AddHealthIndicatorToMedicalConditionResponse>
{
   constructor(private repo: StandardMedicalConditionRepository) {}
   async execute(request: AddHealthIndicatorToMedicalConditionRequest): Promise<AddHealthIndicatorToMedicalConditionResponse> {
      try {
         const medicalCondition = await this.getStandardMedicalCondition(request.standardMedicalConditionId);
         this.addHealthIndicatorToMedicalCondition(medicalCondition, request.healthIndicatords);
         await this.saveStandardObjective(medicalCondition);
         return right(Result.ok<void>());
      } catch (error) {
         if (
            error instanceof AddHealthIndicatorToStandardMedicalConditionErrors.HealthIndicatorCreationFailed ||
            error instanceof AddHealthIndicatorToStandardMedicalConditionErrors.StandardMedicalConditionValidationError ||
            error instanceof AddHealthIndicatorToStandardMedicalConditionErrors.StandardMedicalConditionRepoError
         )
            return left(error);
         else return left(new AppError.UnexpectedError(error));
      }
   }

   addHealthIndicatorToMedicalCondition(medicalCondition: StandardMedicalCondition, healthIndicators: IHealthIndicator[]) {
      try {
         const healthIndicatorResults = healthIndicators.map((healthIndicator: IHealthIndicator) => HealthIndicator.create(healthIndicator));
         const healthIndicatorCombineResult = Result.combine(healthIndicatorResults);
         if (healthIndicatorCombineResult.isFailure)
            throw new AddHealthIndicatorToStandardMedicalConditionErrors.StandardMedicalConditionValidationError(healthIndicatorCombineResult.err);
         const healthIndicatorResultVals = healthIndicatorResults.map((healthIndicator) => healthIndicator.val);
         medicalCondition.addHealthIndicator(...healthIndicatorResultVals);
      } catch (error) {
         throw new AddHealthIndicatorToStandardMedicalConditionErrors.StandardMedicalConditionValidationError(error);
      }
   }

   private async getStandardMedicalCondition(medicalConditionId: AggregateID): Promise<StandardMedicalCondition> {
      try {
         const medicalCondition = await this.repo.getById(medicalConditionId);
         return medicalCondition;
      } catch (error) {
         throw new AddHealthIndicatorToStandardMedicalConditionErrors.StandardMedicalConditionNotFoundError(error, medicalConditionId);
      }
   }
   private async saveStandardObjective(medicalCondition: StandardMedicalCondition) {
      try {
         await this.repo.save(medicalCondition);
      } catch (err: any) {
         throw new AddHealthIndicatorToStandardMedicalConditionErrors.StandardMedicalConditionRepoError(err);
      }
   }
}
