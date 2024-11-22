import { Mapper } from "@shared";
import { Food, FoodQuantity } from "./../../domain";
import { FoodNamePersistenceType, FoodPersistenceType, NutrientAmountPersitenceType } from "./../repositories/types";
import { INutrientAmount, NutrientAmount } from "../../domain/value-objects/NutrientAmount";
import { FoodDto } from "../dtos";
export class FoodMapper implements Mapper<Food, FoodNamePersistenceType, FoodDto> {
   toPersistence(entity: Food): FoodNamePersistenceType {
      const persistenceFood: FoodNamePersistenceType = {
         foodId: entity.id as string,
         foodCode: entity.foodCode,
         groupId: entity.foodGroup.id as string,
         foodName: entity.foodName,
         foodNameF: entity.foodNameF,
         foodOrigin: entity.foodOrigin,
         foodSource: entity.foodSource,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
         foodNutrients: entity.foodNutrients.map((value: INutrientAmount) => ({
            nutrientId: value.nutrientId as string,
            nutrientValue: value.value,
            originalValue: value?.originalValue,
         })),
      };
      return persistenceFood;
   }
   toDomain(record: FoodPersistenceType): Food {
      const { foodGroup, foodNutrients, ...otherRecordProps } = record;
      const foodQuantity = new FoodQuantity({
         value: 0,
         unit: "g",
      });
      const foodNutrientAmounts = foodNutrients.map(
         (value: NutrientAmountPersitenceType) =>
            new NutrientAmount({
               nutrientId: value.nutrientId,
               value: value.nutrientValue,
               originalValue: value?.originalValue,
            }),
      );
      return new Food({
         id: otherRecordProps.foodId,
         createdAt: otherRecordProps.createdAt,
         updatedAt: otherRecordProps.updatedAt,
         props: {
            foodQuantity,
            foodCode: otherRecordProps.foodCode,
            foodGroup,
            foodNutrients: foodNutrientAmounts,
            foodName: otherRecordProps.foodName,
            foodOrigin: otherRecordProps.foodOrigin,
            foodSource: otherRecordProps.foodSource,
            foodNameTranslate: {
               inFrench: otherRecordProps.foodNameF,
            },
         },
      });
   }
   toResponse(entity: Food): FoodDto {
      const dto: FoodDto = {
         foodId: entity.id as string,
         foodCode: entity.foodCode,
         foodName: entity.foodName,
         foodNameF: entity.foodNameF,
         foodOrigin: entity.foodOrigin,
         foodSource: entity.foodSource,
         nutrients: entity.foodNutrients,
         groupId: entity.foodGroup.id as string,
         groupCode: entity.foodGroup.foodGroupCode,
         groupName: entity.foodGroup.foodGroupName,
         groupNameF: entity.foodGroup.foodGroupNameF,
         quantity: entity.foodQuantity,
      };
      return dto;
   }
}
