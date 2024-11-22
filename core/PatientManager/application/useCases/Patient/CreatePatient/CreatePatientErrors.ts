import { UseCaseError, Result,AggregateID } from "@shared";
export namespace CreatePatientErrors {
   export class PatientRepoError extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Patient Repository Error. Try this operation after a few moment.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class PatientFactoryError extends Result<UseCaseError> {
      constructor(e: any) {
         const message = `Patient Creation error.Retry![Error]:${e?.toJSON() || e}`;
         super(false, { message } as UseCaseError);
      }
   }
}
