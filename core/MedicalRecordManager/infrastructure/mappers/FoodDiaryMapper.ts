import { FoodDiary, FoodDiaryFoodItem, FoodDiaryMealEntry, FoodItemProps } from "./../../domain";
import { Mapper, RegistrationDate, Quantity, Image } from "@shared";
import { FoodDiaryPersistenceType } from "./../repositories";
import { FoodDiaryDto } from "./../dtos/FoodDiaryDto";

export class FoodDiaryMapper implements Mapper<FoodDiary, FoodDiaryPersistenceType, FoodDiaryDto> {
   toPersistence(entity: FoodDiary): FoodDiaryPersistenceType {
      return {
         id: entity.id as string,
         date: entity.date,
         meal: {
            withCompany: entity.meal.withCompany,
            watchingTv: entity.meal.watchingTv,
            sittingAtTable: entity.meal.sittingAtTable,
            foodItems: entity.meal.foodItems.map((foodItem: FoodDiaryFoodItem) => ({
               foodId: foodItem.foodId,
               recipeId: foodItem.recipeId,
               isRecipe: foodItem.isRecipe,
               isHomeMade: foodItem.isHomeMade,
               quantity: foodItem.quantity,
            })),
            mealTypeId: entity.meal.mealTypeId,
            description: entity.meal.description,
         },
         observation: entity.observation,
         images: entity.images,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: FoodDiaryPersistenceType): FoodDiary {
      const { id, createdAt, updatedAt, date, meal, images, ...otherProps } = record;
      const { foodItems, ...otherMealProps } = meal;
      const newFoodItems = foodItems.map((fItem: FoodItemProps) => {
         const { quantity, ...otherFoodItemProps } = fItem;
         return new FoodDiaryFoodItem({
            quantity: new Quantity(quantity),
            ...otherFoodItemProps,
         });
      });
      const newMeal = new FoodDiaryMealEntry({
         foodItems: newFoodItems,
         ...otherMealProps,
      });
      const newImages = images.map((url: string) => new Image(url));
      return new FoodDiary({
         id,
         createdAt,
         updatedAt,
         props: { date: new RegistrationDate(date), meal: newMeal, images: newImages, ...otherProps },
      });
   }
   toResponse(entity: FoodDiary): FoodDiaryDto {
      return {
         id: entity.id,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
         date: entity.date,
         meal: {
            withCompany: entity.meal.withCompany,
            watchingTv: entity.meal.watchingTv,
            sittingAtTable: entity.meal.sittingAtTable,
            foodItems: entity.meal.foodItems.map((foodItem: FoodDiaryFoodItem) => ({
               foodId: foodItem.foodId,
               recipeId: foodItem.recipeId,
               isRecipe: foodItem.isRecipe,
               isHomeMade: foodItem.isHomeMade,
               quantity: foodItem.quantity,
            })),
            mealTypeId: entity.meal.mealTypeId,
            description: entity.meal.description,
         },
         observation: entity.observation,
         images: entity.images,
      };
   }
}
