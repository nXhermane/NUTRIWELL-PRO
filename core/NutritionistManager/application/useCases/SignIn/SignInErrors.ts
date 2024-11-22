import { Result, UseCaseError } from "@shared"

export namespace SignInErrors {
    export class NutritionistAuthServiceError extends Result<UseCaseError> {
        constructor(err: any) {
           const message = `Nutritionist AuthService Error. Try this operation after a few moment.[Error]:${err?.toJSON() || err}`;
           super(false, { message } as UseCaseError);
        }
     } 
}