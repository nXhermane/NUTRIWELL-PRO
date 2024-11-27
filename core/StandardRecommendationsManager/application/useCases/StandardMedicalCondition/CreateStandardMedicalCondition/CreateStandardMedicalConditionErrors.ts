import { Result, UseCaseError } from "@/core/shared";

export namespace CreateStandardMedicalConditionErrors {
   export class CreateStandardMedicalConditionFailed extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Error on the creation of the standard medicalCondition with the factory. Be sure to check the data supply.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class CreateStandardMedicalConditionError extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `StandardMedicalCondition Repository Error. Try this operation after a few moment.`;
         super(false, { message } as UseCaseError);
      }
   }
}
