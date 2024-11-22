import { INutrientAmount } from "../../value-objects/NutrientAmount";
import { Recipe } from "./../../aggregates/Recipe";
export interface INutritionCalculatorService {
   calculateRecipeNutritionalValue(recipe: Recipe): Promise<INutrientAmount[]>;
}
