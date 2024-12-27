import { Result, UseCaseError } from "@/core/shared";

export namespace AddMedicalAnalyseToPatientProfilErrors {
   export class PatientProfilRepoError extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `PatientProfil Repository Error. Try this operation after a few moment.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class DataValidationError extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Data Validation Error. Try to verify the props.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
