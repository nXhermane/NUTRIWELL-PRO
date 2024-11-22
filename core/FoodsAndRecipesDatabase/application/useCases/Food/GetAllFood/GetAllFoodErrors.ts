import { UseCaseError, Result } from "@shared";

export namespace GetAllFoodErrors {
   export class FoodRepositoryError extends Result<UseCaseError> {
      constructor(err: any) {
         super(false, {
            message: `Error in food repository. Try this operation later. [${err}]`,
         } as UseCaseError);
      }
   }
}
