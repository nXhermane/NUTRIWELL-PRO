import { AppError, Either, Result } from "@shared";
export type DeleteRecipeResponse = Either<AppError.UnexpectedError, Result<boolean>>;
