import { Result, UseCaseError ,AggregateID} from "@shared";
export namespace GetPatientErrors {
   export class PatientNotFoundError extends Result<UseCaseError> {
      constructor(err: any, id?: AggregateID) {
         const message = `The Patient with id:${id} is not found.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
