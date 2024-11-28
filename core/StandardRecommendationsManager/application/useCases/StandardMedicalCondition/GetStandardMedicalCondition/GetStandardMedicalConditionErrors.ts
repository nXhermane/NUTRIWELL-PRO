import { AggregateID, Result, UseCaseError } from "@/core/shared";

export namespace GetStandardMedicalConditionErrors {
   export class MedicalConditionNotFoundError extends Result<UseCaseError> {
      constructor(err: any, idOrCode?: AggregateID) {
         const message = `The StandardMedicalCondition with id or code:${idOrCode} is not found.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
