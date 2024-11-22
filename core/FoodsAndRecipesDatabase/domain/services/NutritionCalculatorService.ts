import { INutritionCalculatorService } from "./interfaces/INutritionCalculatorService";
import { Recipe } from "./../aggregates/Recipe";
import { FoodRepository } from "./../../infrastructure";
import { IIngredient } from "./../value-objects/Ingredient";
import { IQuantity } from "@shared";
import { INutrientAmount } from "../value-objects/NutrientAmount";
export class NutritionCalculatorService implements INutritionCalculatorService {
   constructor(private foodRepo: FoodRepository) {}
   async calculateRecipeNutritionalValue(recipe: Recipe): Promise<INutrientAmount[]> {
      const nutritionalValue: { [key: string]: INutrientAmount } = {};
      const ingredients = recipe.ingredients;

      // Récupération asynchrone des données des aliments
      const ingredientWithNutrientValue = await Promise.all(
         ingredients.map(async (ingredient: IIngredient) => {
            const food = await this.foodRepo.getById(ingredient.foodId);
            const nutrientValues = this.convertNutrientQuantityToNewQuantity(food.foodNutrients, food.foodQuantity, ingredient.quantity.unpack());
            return { ingredient, nutrientValues };
         }),
      );

      // Agrégation des valeurs nutritionnelles par nutriment
      ingredientWithNutrientValue.forEach(({  nutrientValues }) => {
         nutrientValues.forEach((nutrient: INutrientAmount) => {
            const existingNutrient = nutritionalValue[nutrient.nutrientId];
            if (existingNutrient) {
               existingNutrient.value += nutrient.value;
            } else {
               nutritionalValue[nutrient.nutrientId] = nutrient;
            }
         });
      });

      // Conversion de l'objet en tableau et retour
      return Object.values(nutritionalValue);
   }
   /**
    * Convert NutrientValue
    * ||prevNutrientValue--->prevQuantity
    * ||newNutrientValue---->newQuantity
    * ||newNutrientValue=prevValue*newQuantity/prevQuantity
    * */

   convertNutrientQuantityToNewQuantity(nutrients: INutrientAmount[], prevQuantity: IQuantity, newQuantity: IQuantity): INutrientAmount[] {
      const prevValue = prevQuantity.unit === newQuantity.unit ? prevQuantity.value : 0;
      const newValue = prevQuantity.unit === newQuantity.unit ? newQuantity.value : 0;
      return nutrients.map((nutrient: INutrientAmount) => {
         nutrient.value = (nutrient.value * newValue) / prevValue;
         return nutrient;
      });
   }
}
