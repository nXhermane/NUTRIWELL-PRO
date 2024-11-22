import { AggregateID, Either, Result, AppError } from "@shared";
import { CreateRecipeErrors } from "./CreateRecipeErrors";
export type CreateRecipeResponse = Either<
   AppError.UnexpectedError | CreateRecipeErrors.CreateRecipeFailed | CreateRecipeErrors.RecipeRepoError,
   Result<AggregateID>
>;
