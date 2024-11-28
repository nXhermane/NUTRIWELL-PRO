import { AggregateID, AppError, HealthIndicator, IHealthIndicator, left, Result, right, UseCase } from "@/core/shared";
import { UpdateStandardMedicalConditionDto, UpdateStandardMedicalConditionRequest } from "./UpdateStandardMedicalConditionRequest";
import { UpdateStandardMedicalConditionResponse } from "./UpdateStandardMedicalConditionResponse";
import { UpdateStandardMedicalConditionErrors } from "./UpdateStandardMedicalConditionErrors";
import { StandardMedicalConditionRepository } from "@/core/StandardRecommendationsManager/infrastructure";
import { StandardMedicalCondition } from "@/core/StandardRecommendationsManager/domain";

export class UpdateStandardMedicalConditionUseCase implements UseCase<UpdateStandardMedicalConditionRequest, UpdateStandardMedicalConditionResponse> {
   constructor(private repo: StandardMedicalConditionRepository) {}
   async execute(request: UpdateStandardMedicalConditionRequest): Promise<UpdateStandardMedicalConditionResponse> {
      try {
         const medicalCondition = await this.getStandardMedicalCondition(request.standardMedicalConditionId);
         this.updateStandardMedicalCondition(medicalCondition, request.data);
         await this.saveStandardMedicalCondition(medicalCondition);
         return right(Result.ok<void>());
      } catch (error) {
         if (
            error instanceof UpdateStandardMedicalConditionErrors.StandardMedicalConditionRepoError ||
            error instanceof UpdateStandardMedicalConditionErrors.StandardMedicalConditionValidationError ||
            error instanceof UpdateStandardMedicalConditionErrors.StandardMedicalConditionnNotFoundError
         )
            return left(error);
         else return left(new AppError.UnexpectedError(error));
      }
   }

   private updateStandardMedicalCondition(medicalCondition: StandardMedicalCondition, data: UpdateStandardMedicalConditionDto): void {
      try {
         if (data.criteria) medicalCondition.criteria = data.criteria;
         if (data.description) medicalCondition.description = data.description;
         if (data.name) medicalCondition.name = data.name;
         if (data.healthIndicators) {
            const healthIndicatorResults = data.healthIndicators.map((healthIndicator: IHealthIndicator) => HealthIndicator.create(healthIndicator));
            const healthIndicatorCombineResult = Result.combine(healthIndicatorResults);
            if (healthIndicatorCombineResult.isFailure)
               throw new UpdateStandardMedicalConditionErrors.StandardMedicalConditionValidationError(healthIndicatorCombineResult.err);
            const healthIndicators = healthIndicatorResults.map((healthIndicator) => healthIndicator.val);
            medicalCondition.addHealthIndicator(...healthIndicators);
         }
      } catch (e: any) {
         throw new UpdateStandardMedicalConditionErrors.StandardMedicalConditionValidationError(e);
      }
   }

   private async getStandardMedicalCondition(medicalConditionId: AggregateID): Promise<StandardMedicalCondition> {
      try {
         const medicalCondition = await this.repo.getById(medicalConditionId);
         return medicalCondition;
      } catch (error) {
         throw new UpdateStandardMedicalConditionErrors.StandardMedicalConditionnNotFoundError(error, medicalConditionId);
      }
   }
   private async saveStandardMedicalCondition(medicalCondition: StandardMedicalCondition) {
      try {
         await this.repo.save(medicalCondition);
      } catch (err: any) {
         throw new UpdateStandardMedicalConditionErrors.StandardMedicalConditionRepoError(err);
      }
   }
}
