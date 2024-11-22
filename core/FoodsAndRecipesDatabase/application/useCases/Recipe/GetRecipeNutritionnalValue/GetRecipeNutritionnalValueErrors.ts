import { AggregateID, UseCaseError, Result } from "@shared";

export namespace GetRecipeNutritionnalValueErrors {
   export class RecipeNotFoundError extends Result<UseCaseError> {
      constructor(err: any, id: AggregateID) {
         const message = `The Recipe with id:${id} is not found.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
