import { Either, AppError, Result } from "@shared";
import { GetRecipeByIdErrors } from "./GetRecipeByIdErrors";
import { RecipeDto } from "./../../../../infrastructure";
export type GetRecipeByIdResponse = Either<AppError.UnexpectedError | GetRecipeByIdErrors.RecipeNotFoundError, Result<RecipeDto>>;
