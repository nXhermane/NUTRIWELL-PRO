import { DeleteRecipeRequest } from "./DeleteRecipeRequest";
import { DeleteRecipeResponse } from "./DeleteRecipeResponse";
import { UseCase, AppError, Result, left, right } from "@shared";
import { RecipeRepository, RecipeRepositoryError } from "./../../../../infrastructure";
export class DeleteRecipeUseCase implements UseCase<DeleteRecipeRequest, DeleteRecipeResponse> {
   constructor(private repo: RecipeRepository) {}

   async execute(request: DeleteRecipeRequest): Promise<DeleteRecipeResponse> {
      try {
         await this.repo.delete(request.recipeId);
         return right(Result.ok<boolean>(true));
      } catch (e) {
         if (e instanceof RecipeRepositoryError) return right(Result.ok<boolean>(false));
         return left(new AppError.UnexpectedError(e));
      }
   }
}
