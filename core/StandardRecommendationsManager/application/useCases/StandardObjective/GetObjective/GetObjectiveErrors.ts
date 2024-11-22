import { AggregateID, Result, UseCaseError } from "@/core/shared";

export namespace GetStandardObjectiveErrors {
   export class ObjectiveNotFoundError extends Result<UseCaseError> {
      constructor(err: any, idOrCode?: AggregateID) {
         const message = `The StandardObjective with id or code:${idOrCode} is not found.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
