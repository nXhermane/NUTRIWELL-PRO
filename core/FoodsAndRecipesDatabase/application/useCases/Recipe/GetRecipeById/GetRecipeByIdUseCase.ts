import { GetRecipeByIdErrors } from "./GetRecipeByIdErrors";
import { GetRecipeByIdResponse } from "./GetRecipeByIdResponse";
import { GetRecipeByIdRequest } from "./GetRecipeByIdRequest";
import { UseCase, Mapper, AppError, Result, left, right } from "@shared";
import { RecipeRepository, RecipeRepositoryNotFoundException, RecipePersistenceType, RecipeDto } from "./../../../../infrastructure";
import { Recipe } from "./../../../../domain";

export class GetRecipeByIdUseCase implements UseCase<GetRecipeByIdRequest, GetRecipeByIdResponse> {
   constructor(
      private repo: RecipeRepository,
      private mapper: Mapper<Recipe, RecipePersistenceType, RecipeDto>,
   ) {}

   async execute(request: GetRecipeByIdRequest): Promise<GetRecipeByIdResponse> {
      try {
         const recipe = await this.repo.getRecipeById(request.recipeId);
         return right(Result.ok<RecipeDto>(this.mapper.toResponse(recipe)));
      } catch (e) {
         if (e instanceof RecipeRepositoryNotFoundException) {
            return left(new GetRecipeByIdErrors.RecipeNotFoundError(e, request.recipeId));
         } else {
            return left(new AppError.UnexpectedError(e));
         }
      }
   }
}
