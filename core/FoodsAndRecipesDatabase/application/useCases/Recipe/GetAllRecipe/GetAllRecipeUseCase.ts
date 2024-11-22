import { UseCase, Mapper, Result, AppError, left, right } from "@shared";
import { GetAllRecipeRequest } from "./GetAllRecipeRequest";
import { GetAllRecipeResponse } from "./GetAllRecipeResponse";
import { GetAllRecipeErrors } from "./GetAllRecipeErrors";
import { RecipeRepository, RecipeRepositoryError, RecipeRepositoryNotFoundException, RecipePersistenceType, RecipeDto } from "./../../../../infrastructure";
import { Recipe } from "./../../../../domain";


export class GetAllRecipeUseCase implements UseCase<GetAllRecipeRequest, GetAllRecipeResponse> {
   constructor(
      private repo: RecipeRepository,
      private mapper: Mapper<Recipe, RecipePersistenceType, RecipeDto>,
   ) {}

   async execute(request: GetAllRecipeRequest = {}): Promise<GetAllRecipeResponse> {
      try {
         const recipes = await this.repo.getAllRecipe({
            page: request?.paginated?.page || 0,
            pageSize: request?.paginated?.pageSize || 100,
         });
         return right(Result.ok<RecipeDto[]>(recipes.map((recipe: Recipe) => this.mapper.toResponse(recipe))));
      } catch (e) {
         if (e instanceof RecipeRepositoryNotFoundException) {
            return right(Result.ok<RecipeDto[]>([]));
         } else if (e instanceof RecipeRepositoryError) {
            return left(new GetAllRecipeErrors.RecipeRepositoryError(e));
         } else {
            return left(new AppError.UnexpectedError(e));
         }
      }
   }
}
