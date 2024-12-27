import { Result, UseCaseError, AggregateID } from "@/core/shared";

export namespace DeleteVariableFromPatientDataVariableErrors {
   export class VariableNotFound extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Variable not found. [Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class PatientDataVariableNotFoundError extends Result<UseCaseError> {
      constructor(err: any, idOrCode?: AggregateID) {
         const message = `The PatientDataVariable with id or code:${idOrCode} is not found.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
