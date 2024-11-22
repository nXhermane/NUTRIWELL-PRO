import { AppError, Either, Result } from "@shared";
import { ValidateTokenErrors } from "./ValidateTokenErrors";

export type ValidateTokenResponse = Either<AppError.UnexpectedError | ValidateTokenErrors.InvalidToken, Result<{ unique_id: string; email: string }>>;
