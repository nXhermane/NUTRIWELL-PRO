import { Result, UseCaseError } from "@shared";

export namespace RefreshTokenErrors {
   export class InvalidRefreshToken extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Refresh token is not valid . Please login to your Account . [Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
