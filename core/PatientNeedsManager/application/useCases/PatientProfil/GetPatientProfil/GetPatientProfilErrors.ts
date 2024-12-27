import { Result, UseCaseError, AggregateID } from "@/core/shared";

export namespace GetPatientProfilErrors {
   export class PatientProfilNotFoundError extends Result<UseCaseError> {
      constructor(err: any, idOrCode?: AggregateID) {
         const message = `The PatientProfil with id or code:${idOrCode} is not found.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
