import { Result, UseCaseError, AggregateID } from "@shared";
export namespace CreateEatingBehaviorErrors {
   export class MedicalRecordNotFoundError extends Result<UseCaseError> {
      constructor(err: any, id?: AggregateID) {
         const message = `The MedicalRecord or Patient with id:${id} is not found.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class MedicalRecordRepoError extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `MedicalRecord Repository Error. Try this operation after a few moment.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class EatingBehaviorFactoryError extends Result<UseCaseError> {
      constructor(e: any) {
         const message = `Eating Behavior Creation error.[Error]:${e?.toJSON() || e}`;
         super(false, { message } as UseCaseError);
      }
   }
}
