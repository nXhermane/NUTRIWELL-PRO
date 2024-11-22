import { SignUpErrors } from "./SignUpErrors";
import { SignUpRequest } from "./SignUpRequest";
import { SignUpResponse } from "./SignUpResponse";
import { Result, left, right, AppError, UseCase } from "@shared";
import { IAuthNutritionistService } from "./../../../domain/services";
import { Nutritionist } from "./../../../domain";
export class SignUpUseCase implements UseCase<SignUpRequest, SignUpResponse> {
   constructor(private authService: IAuthNutritionistService) {}
   async execute(request: SignUpRequest | undefined): Promise<SignUpResponse> {
      try {
         const { password, ...otherProps } = request!.data;
         const nutritionist = Nutritionist.create(otherProps);
         if (nutritionist.isFailure) return left(new SignUpErrors.NutritionistFactoryError(nutritionist.err));
         const signUpResult = await this.authService.signUp(nutritionist.val, password);
         if (signUpResult.isFailure) return left(new SignUpErrors.NutritionistAuthServiceError(signUpResult.err));
         return right(Result.ok());
      } catch (error: any) {
         return left(new AppError.UnexpectedError(error));
      }
   }
}
