import { Result, UseCaseError } from "@shared";
export namespace CreateMedicalRecordErrors {
   export class MedicalRecordRepoError extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `MedicalRecord Repository Error. Try this operation after a few moment.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class CreateMedicalRecordFailed extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Error on the creation of MedicalRecord with the factory. Be sure to check the data supply.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
