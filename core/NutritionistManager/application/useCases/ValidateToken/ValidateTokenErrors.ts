import { Result, UseCaseError } from "@shared";

export namespace ValidateTokenErrors {
   export class InvalidToken extends Result<UseCaseError> {  
      constructor(err: any) {
         const message = `Access Token is not valid please login to your account now.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
     }    


}
