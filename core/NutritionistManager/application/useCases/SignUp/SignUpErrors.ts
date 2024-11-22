import { Result, UseCaseError } from "@shared";
export namespace SignUpErrors {
   
   export class NutritionistAuthServiceError extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Nutritionist AuthService Error. Try this operation after a few moment.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class NutritionistFactoryError extends Result<UseCaseError> {
      constructor(e: any) {
         const message = `Nutritionist Creation error.[Error]:${e?.toJSON() || e}`;
         super(false, { message } as UseCaseError);
      }
   }
}
