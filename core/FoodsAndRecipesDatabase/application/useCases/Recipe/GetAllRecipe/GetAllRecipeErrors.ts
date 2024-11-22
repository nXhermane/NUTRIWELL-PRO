import { UseCaseError, Result } from "@shared";

export namespace GetAllRecipeErrors {
   export class RecipeRepositoryError extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Error in Recipe Repository. Please try this operation after a few moment.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
