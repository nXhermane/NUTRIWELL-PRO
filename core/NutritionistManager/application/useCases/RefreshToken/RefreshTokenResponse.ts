import { AppError, Either, Result } from "@shared";
import { RefreshTokenErrors } from "./RefreshTokenErrors";

export type RefreshTokenResponse = Either<
   AppError.UnexpectedError | RefreshTokenErrors.InvalidRefreshToken,
   Result<{ accessToken: string; refreshToken: string }>
>;
