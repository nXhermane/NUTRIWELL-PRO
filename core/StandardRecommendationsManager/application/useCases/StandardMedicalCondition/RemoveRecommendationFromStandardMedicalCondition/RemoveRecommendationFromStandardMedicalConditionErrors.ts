import { Result, UseCaseError, AggregateID } from "@/core/shared";

export namespace RemoveRecommendationFromStandardMedicalConditionErrors {
   export class StandardMedicalConditionnNotFoundError extends Result<UseCaseError> {
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
   export class NeedsRecommendationCreationFailed extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `The NeedsRecommendation creation Failed. Try to verify the props.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
