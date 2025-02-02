import { IngredientDto, PreparationStepDto, QuantityDto } from "./../../../..//infrastructure";
import { AggregateID } from "./../../../../../shared";
import { IMealsCategory } from "./../../../../domain/value-objects/MealsCategory";
import { IMealsType } from "./../../../../domain/value-objects/MealsType";
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
