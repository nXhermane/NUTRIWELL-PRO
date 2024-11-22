import { AppError, Either, Result } from "@shared";
import { SignInErrors } from "./SignInErrors";

export type SignInResponse = Either<
   AppError.UnexpectedError | SignInErrors.NutritionistAuthServiceError,
   Result<{ accessToken: string; refreshToken: string }>
>;
