import { BaseEntityProps, AggregateID, IQuantity } from "@shared";

export interface FoodDiaryDto extends BaseEntityProps {
   date: string;
   meal: {
      withCompany: boolean;
      watchingTv: boolean;
      sittingAtTable: boolean;
      foodItems: {
         foodId?: AggregateID;
         recipeId?: AggregateID;
         isRecipe: boolean;
         isHomeMade: boolean;
         quantity: IQuantity;
      }[];
      mealTypeId: AggregateID;
      description: string;
   };
   observation: string;
   images: string[];
}
