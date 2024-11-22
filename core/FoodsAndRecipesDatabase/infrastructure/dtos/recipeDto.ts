import { AggregateID } from "@shared";
import { IngredientDto } from "./ingredientDto";
import { MealsCategoryDto } from "./mealsCategoryDto";
import { MealsTypeDto } from "./mealsTypeDto";
import { PreparationStepDto } from "./preparationStepDto";
import { QuantityDto } from "./quantityDto";

export type RecipeDto = {
    name: string;
    nameF: string;
    cookingTime: number;
    type: MealsTypeDto;
    category: MealsCategoryDto;
    preparationMethod: PreparationStepDto[];
    quantity: QuantityDto;
    description: string;
    author: string;
    ingredients: IngredientDto[];
    id: AggregateID;
    createdAt: string;
    updatedAt: string;
 };