import { AggregateID, Result, UseCaseError } from "@/core/shared";

export namespace AddHealthIndicatorToStandardMedicalConditionErrors {
   export class StandardMedicalConditionNotFoundError extends Result<UseCaseError> {
      constructor(err: any, id?: AggregateID) {
         const message = `The Standard MedicalCondition with id:${id} is not found.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class StandardMedicalConditionRepoError extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Standard MedicalConditionn Repository Error. Try this operation after a few moment.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class StandardMedicalConditionValidationError extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Standard MedicalCondition Validation Error. Try to verify the props.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class HealthIndicatorCreationFailed extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `The HealthIndicator creation Failed. Try to verify the props.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
