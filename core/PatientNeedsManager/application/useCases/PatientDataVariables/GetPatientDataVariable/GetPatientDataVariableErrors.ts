import { AggregateID, Result, UseCaseError } from "@/core/shared";

export namespace GetPatientDataVariableErrors {
   export class PatientDataVariableNotFoundError extends Result<UseCaseError> {
      constructor(err: any, idOrCode?: AggregateID) {
         const message = `The PatientDataVariable with id or code:${idOrCode} is not found.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
