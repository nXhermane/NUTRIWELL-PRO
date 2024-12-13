import { UseCaseError, Result, AggregateID } from "@shared";
export namespace DeletePatientErrors {
   export class PatientNotFoundError extends Result<UseCaseError> {
      constructor(err: any, id?: AggregateID) {
         const message = `The Patient with id:${id} not found.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
