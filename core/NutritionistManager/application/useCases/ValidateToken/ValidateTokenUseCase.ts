import { AppError, left, Result, right, UseCase } from "@shared";
import { ValidateTokenRequest } from "./ValidateTokenRequest";
import { ValidateTokenResponse } from "./ValidateTokenResponse";
import { IAuthNutritionistService } from "../../../domain/services";
import { ValidateTokenErrors } from "./ValidateTokenErrors";

export class ValidateTokenUseCase implements UseCase<ValidateTokenRequest, ValidateTokenResponse> {
   constructor(private authService: IAuthNutritionistService) {}
   async execute(request: ValidateTokenRequest): Promise<ValidateTokenResponse> {
      try {
         const validateTokenResult = await this.authService.validateAccessToken(request.data.token);
         if (validateTokenResult.isFailure) return left(new ValidateTokenErrors.InvalidToken(validateTokenResult.err));
         return right(Result.ok<{ unique_id: string; email: string }>(validateTokenResult.val));
      } catch (error: any) {
         return left(new AppError.UnexpectedError(error));
      }
   }
}
