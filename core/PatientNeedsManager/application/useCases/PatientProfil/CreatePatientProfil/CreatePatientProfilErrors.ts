import { Result, UseCaseError } from "@/core/shared";

export namespace CreatePatientProfilErrors {
   export class PatientProfilRepoError extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `PatientProfil Repository Error. Try this operation after a few moment.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class PatientProfilFactoryError extends Result<UseCaseError> {
      constructor(e: any) {
         const message = `PatientProfil Creation error.Retry![Error]:${e?.toJSON() || e}`;
         super(false, { message } as UseCaseError);
      }
   }
}
