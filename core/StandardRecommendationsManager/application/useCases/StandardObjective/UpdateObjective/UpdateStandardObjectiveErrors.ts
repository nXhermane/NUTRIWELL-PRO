import { AggregateID, Result, UseCaseError } from "@shared";

export namespace UpdateStandardObjectiveErrors {
   export class StandardObjectiveNotFoundError extends Result<UseCaseError> {
      constructor(err: any, id?: AggregateID) {
         const message = `The Standard Objective with id:${id} is not found.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class StandardObjectiveRepoError extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Standard Objective Repository Error. Try this operation after a few moment.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class StandardObjectiveValidationError extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Standard Objective Validation Error. Try to verify the props.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
