import { UseCaseError, Result } from "@shared";

export namespace GetFoodByIdErrors {
   export class FoodNotFoundError extends Result<UseCaseError> {
      constructor(id: string | number) {
         super(false, {
            message: `The food with Id ${id} is not found`,
         } as UseCaseError);
      }
   }
}
