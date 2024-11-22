import { CreateRecipeErrors } from "./CreateRecipeErrors";
import { CreateRecipeRequest } from "./CreateRecipeRequest";
import { CreateRecipeResponse } from "./CreateRecipeResponse";
import { MealsType, IMealsType, MealsCategory, IMealsCategory, Recipe, CreateRecipeProps } from "./../../../../domain";
import { UseCase, Result, left, right, AppError, AggregateID, Guard } from "@shared";
import { RecipeRepository, RecipeRepositoryError } from "./../../../../infrastructure";
export class CreateRecipeUseCase implements UseCase<CreateRecipeRequest, CreateRecipeResponse> {
   constructor(private repo: RecipeRepository) {}

   async execute(request: CreateRecipeRequest): Promise<CreateRecipeResponse> {
      try {
         const { type, category, ...otherProps } = request;
         const newType = Guard.isString(type).succeeded
            ? await this.repo.getRecipeType(type as string)
            : MealsType.create(type as Omit<IMealsType, "typeId">);
         const newCategory = Guard.isString(category)
            ? await this.repo.getRecipeCategory(category as string)
            : MealsCategory.create(category as Omit<IMealsCategory, "categoryId">);
         const recipe = await Recipe.create({ ...otherProps, type: newType, category: newCategory } as CreateRecipeProps);
         if (recipe.isFailure) return left(new CreateRecipeErrors.CreateRecipeFailed(recipe.err));
         this.repo.save(recipe.val);
         return right(Result.ok<AggregateID>(recipe.val.id));
      } catch (e) {
         if (e instanceof RecipeRepositoryError) return left(new CreateRecipeErrors.RecipeRepoError(e));
         return left(new AppError.UnexpectedError(e));
      }
   }
}
