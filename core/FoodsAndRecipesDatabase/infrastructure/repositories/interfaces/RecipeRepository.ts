import { Recipe, IMealsType, IMealsCategory } from "./../../../domain";
import { AggregateID } from "@shared";
export interface RecipeRepository {
   save(recipe: Recipe): Promise<void>;
   delete(recipeId: AggregateID): Promise<void>;
   getRecipeById(recipeId: AggregateID): Promise<Recipe>;
   getAllRecipe(pagginated?: { page: number; pageSize: number }): Promise<Recipe[]>;
   getAllRecipeId(): Promise<AggregateID[]>;
   getRecipeType(typeId: AggregateID): Promise<IMealsType>;
   getRecipeCategory(categoryId: AggregateID): Promise<IMealsCategory>;
   getAllRecipeType(): Promise<IMealsType[]>;
   getAllRecipeCategory(): Promise<IMealsCategory[]>;
}
