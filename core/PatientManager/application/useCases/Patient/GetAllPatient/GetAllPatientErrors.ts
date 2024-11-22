import { Result, UseCaseError } from "@shared";

export namespace GetAllPatientErrors {
   export class PatientRepoError extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Error in Patient Repository. Please try this operation after a few moment.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
