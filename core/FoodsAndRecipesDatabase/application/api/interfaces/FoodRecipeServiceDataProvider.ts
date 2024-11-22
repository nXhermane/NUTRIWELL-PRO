import { FoodNutritionalValue, RecipeNutritionalValue } from "../FoodRecipeServiceDataProvider";
import { FoodDto, NutrientDto, RecipeDto } from "./../../../infrastructure";
import { Result } from "@shared";

type AggregateID = string | number;
export interface IFoodRecipeServiceDataProvider {
   getAllFoodIds(): Promise<AggregateID[]>;
   getAllRecipeIds(): Promise<AggregateID[]>;
   getAllMealTypeIds(): Promise<AggregateID[]>;
   getFoodById(...foodIds: AggregateID[]): Promise<Result<FoodDto[]>>;
   getRecipeById(...recipeIds: AggregateID[]): Promise<Result<RecipeDto[]>>;
   getAllNutrient(): Promise<Result<NutrientDto[]>>;
   getRecipeNutritionalValue(recipeId: AggregateID): Promise<Result<RecipeNutritionalValue>>;
   getFoodNutritionalValue(foodId: AggregateID): Promise<Result<FoodNutritionalValue>>;
}
