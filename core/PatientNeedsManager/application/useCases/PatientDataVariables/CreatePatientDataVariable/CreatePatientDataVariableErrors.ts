import { UseCaseError, Result, AggregateID } from "@shared";
export namespace CreatePatientDataVariableErrors {
   export class PatientDataVariableRepoError extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Patient Repository Error. Try this operation after a few moment.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class PatientDataVariableFactoryError extends Result<UseCaseError> {
      constructor(e: any) {
         const message = `PatientDataVariable Creation error.Retry![Error]:${e?.toJSON() || e}`;
         super(false, { message } as UseCaseError);
      }
   }
}
