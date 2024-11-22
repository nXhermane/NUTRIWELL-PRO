import { UseCaseError, Result, AggregateID } from "@shared";

export namespace GetRecipeByIdErrors {
   export class RecipeNotFoundError extends Result<UseCaseError> {
      constructor(err: any, id: AggregateID) {
         const message = `The Recipe with id:${id} is not found.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
