import { Result, UseCaseError } from "@/core/shared";


export namespace CreateStandardObjectiveErrors {
   export class CreateStandardObjectiveFailed extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Error on the creation of the standard objective with the factory. Be sure to check the data supply.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class CreateStandardObjectiveError extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `StandardObjective Repository Error. Try this operation after a few moment.`;
         super(false, { message } as UseCaseError);
      }
   }
}
