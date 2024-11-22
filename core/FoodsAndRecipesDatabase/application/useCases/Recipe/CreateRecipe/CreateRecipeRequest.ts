
import { IngredientDto, PreparationStepDto, QuantityDto } from "./../../../..//infrastructure";
import { AggregateID } from "./../../../../../shared";
import { IMealsCategory, IMealsType } from "./../../../../domain";
export type CreateRecipeRequest = {
   quantity: QuantityDto;
   type: AggregateID | Omit<IMealsType, "typeId">;
   category: AggregateID | Omit<IMealsCategory, "categoryId">;
   ingredients: IngredientDto[];
   preparationMethod: PreparationStepDto[];
   name: string;
   cookingTime: number;
   description: string;
   author: string;
   nameTranslate?: {
      inFrench?: string;
      inEnglish?: string;
   };
};
