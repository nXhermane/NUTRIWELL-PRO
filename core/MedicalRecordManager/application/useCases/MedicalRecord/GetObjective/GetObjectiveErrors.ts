import { Result, UseCaseError, AggregateID } from "@shared";
export namespace GetObjectiveErrors {
   export class MedicalRecordNotFoundError extends Result<UseCaseError> {
      constructor(err: any, id?: AggregateID) {
         const message = `The MedicalRecord or Patient with id:${id} is not found.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
