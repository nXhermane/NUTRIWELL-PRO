import { CreateEntityProps, IQuantity } from "@shared";
import { IFoodGroup } from "./entities/FoodGroup";
import { INutrientAmount } from "./value-objects/NutrientAmount";
import { IMealsType } from "./value-objects/MealsType";
import { IRecipe } from "./aggregates/Recipe";
import { IIngredient } from "./value-objects/Ingredient";
import { IMealsCategory } from "./value-objects/MealsCategory";
import { IPreparationStep } from "./value-objects/PreparationStep";

export type CreateFoodProps = {
    foodCode: string;
    foodName: string;
    foodOrigin: string;
    foodSource: string;
    foodQuantity: IQuantity
    foodGroup: CreateEntityProps<IFoodGroup>
    foodNameTranslate?: {
       inFrench?: string;
       inEnglish?: string;
    };
    foodNutrients: INutrientAmount[];
}
export type CreateRecipeProps = {
    quantity: IQuantity;
    type: IMealsType;
    category: IMealsCategory;
    ingredients: (Omit<IIngredient, "quantity"> & {
       quantity: IQuantity;
    })[];
    preparationMethod: IPreparationStep[];
 } & Omit<IRecipe, "type" | "category" | "ingredients" | "preparationMethod" | "quantity">;
 