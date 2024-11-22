import { AppError, left, Result, right, UseCase } from "@shared";
import { RefreshTokenRequest } from "./RefreshTokenRequest";
import { RefreshTokenResponse } from "./RefreshTokenResponse";
import { IAuthNutritionistService } from "../../../domain/services";
import { RefreshTokenErrors } from "./RefreshTokenErrors";

export class RefreshTokenUseCase implements UseCase<RefreshTokenRequest, RefreshTokenResponse> {
   constructor(private authService: IAuthNutritionistService) {}
   async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
      try {
         const refreshTokenResult = await this.authService.refreshAccessToken(request.data.refreshToken);
         if (refreshTokenResult.isFailure) return left(new RefreshTokenErrors.InvalidRefreshToken(refreshTokenResult.err));
         return right(Result.ok<{ accessToken: string; refreshToken: string }>(refreshTokenResult.val));
      } catch (error: any) {
         return left(new AppError.UnexpectedError(error));
      }
   }
}
