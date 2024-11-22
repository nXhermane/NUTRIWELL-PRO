import { Result, UseCaseError } from "@shared";

export namespace CreateRecipeErrors {
   export class CreateRecipeFailed extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Error on the creation of the recipe with the factory. Be sure to check the data supply.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class RecipeRepoError extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Recipe Repository Error. Try this operation after a few moment.`;
         super(false, { message } as UseCaseError);
      }
   }
}
