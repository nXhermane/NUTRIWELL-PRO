import { Result, UseCaseError } from "@/core/shared";

export namespace RemoveAnthropometricFromPatientProfilErrors {
      export class PatientProfilRepoError extends Result<UseCaseError> {
          constructor(err: any) {
             const message = `PatientProfil Repository Error. Try this operation after a few moment.[Error]:${err?.toJSON() || err}`;
             super(false, { message } as UseCaseError);
          }
       }
}