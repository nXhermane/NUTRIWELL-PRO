import { IAuthNutritionistService } from "../../../domain/services";
import { SignInErrors } from "./SignInErrors";
import { SignInRequest } from "./SignInRequest";
import { SignInResponse } from "./SignInResponse";
import { AppError, left, Result, right, UseCase } from "@shared";

export class SignInUseCase implements UseCase<SignInRequest, SignInResponse> {
   constructor(private authSerice: IAuthNutritionistService) {}
   async execute(request: SignInRequest): Promise<SignInResponse> {
      try {
         const loginResult = await this.authSerice.login(request.data.email, request.data.password);
         if (loginResult.isFailure) return left(new SignInErrors.NutritionistAuthServiceError(loginResult.err));
         return right(Result.ok<{ accessToken: string; refreshToken: string }>(loginResult.val));
      } catch (err: any) {
         return left(new AppError.UnexpectedError(err));
      }
   }
}
