import { AggregateID, IQuantity, Result } from "@/core/shared";
import { Intake } from "../../domain/value-objects/Intake";
import { IIntakeDataACL } from "./interfaces/IntakeDataACL";
import { FoodAndRecipeApi, NutritionalValue } from "@/core/FoodsAndRecipesDatabase/application";
import { MedicalRecordAPI } from "@/core/MedicalRecordManager/application/api";
import { FoodDiaryDto } from "@/core/MedicalRecordManager/infrastructure";
import { CreateIntakeDataProps } from "../../domain/types";
type IntakePrimaryData = {
   date: string;
   foodOrRecipeId: AggregateID;
   isRecipe: boolean;
   quantity: IQuantity;
};
type IntakeSecondaryData = {
   date: string;
   foodOrRecipeId: AggregateID;
   isRecipe: boolean;
   quantity: IQuantity;
   defaultQuantity: IQuantity;
   nutrients: NutritionalValue[];
};

export class IntakeDataACL implements IIntakeDataACL {
   async getIntakeByPatientId(patientId: AggregateID): Promise<Result<Intake[]>> {
      try {
         const intakePrimaryDataResult = await this.getIntakePrimaryData(patientId);
         if (intakePrimaryDataResult.isFailure) return Result.fail<Intake[]>(String(intakePrimaryDataResult.err));
         const intakeSecondaryDataResult = await this.getIntakeSecondaryData(intakePrimaryDataResult.val);
         if (intakeSecondaryDataResult.isFailure) return Result.fail<Intake[]>(String(intakeSecondaryDataResult.err));
         const createIntakeDataProps = this.generateIntakeProps(intakeSecondaryDataResult.val);
         const intakeResults = createIntakeDataProps.map((value: CreateIntakeDataProps) => Intake.create(value));
         const validateResult = Result.combine(intakeResults);
         if (validateResult.isFailure) return Result.fail(String(validateResult.err));
         return Result.ok<Intake[]>(intakeResults.map((intakeResult: Result<Intake>) => intakeResult.val));
      } catch (error) {
         return Result.fail<Intake[]>("Unexpected Error" + error);
      }
   }

   private async getIntakePrimaryData(patientId: AggregateID): Promise<Result<IntakePrimaryData[]>> {
      try {
         const foodDiaryDtos = await (await MedicalRecordAPI.getInstance()).getFoodDiaryByPatientId(patientId);
         if (foodDiaryDtos.isFailure) return Result.fail<IntakePrimaryData[]>(String(foodDiaryDtos.err));
         const foodItemsAndDate = foodDiaryDtos.val.map((foodDiaryDto: FoodDiaryDto) => {
            return {
               date: foodDiaryDto.date,
               foodItems: foodDiaryDto.meal.foodItems.filter(
                  (foodItem: { foodId?: AggregateID; recipeId?: AggregateID; isRecipe: boolean; isHomeMade: boolean; quantity: IQuantity }) =>
                     !foodItem.isHomeMade,
               ),
            };
         });
         const intakeData: IntakePrimaryData[] = [];
         foodItemsAndDate.forEach(
            (foodItemAndDate: {
               date: string;
               foodItems: {
                  foodId?: AggregateID;
                  recipeId?: AggregateID;
                  isRecipe: boolean;
                  isHomeMade: boolean;
                  quantity: IQuantity;
               }[];
            }) => {
               const { date, foodItems } = foodItemAndDate;
               for (const foodItem of foodItems) {
                  if (foodItem.isRecipe) {
                     intakeData.push({
                        date,
                        foodOrRecipeId: foodItem.recipeId as AggregateID,
                        isRecipe: foodItem.isRecipe,
                        quantity: foodItem.quantity,
                     });
                  } else {
                     intakeData.push({
                        date,
                        foodOrRecipeId: foodItem.foodId as AggregateID,
                        isRecipe: foodItem.isRecipe,
                        quantity: foodItem.quantity,
                     });
                  }
               }
            },
         );
         return Result.ok<IntakePrimaryData[]>(intakeData);
      } catch (error) {
         return Result.fail<IntakePrimaryData[]>("Unexpected error" + error);
      }
   }

   private async getIntakeSecondaryData(intakePrimaryData: IntakePrimaryData[]): Promise<Result<IntakeSecondaryData[]>> {
      try {
         const intakeData: IntakeSecondaryData[] = await Promise.all(
            intakePrimaryData.map(async (value: IntakePrimaryData) => {
               if (value.isRecipe) {
                  const recipe = await (await FoodAndRecipeApi.getInstance()).getRecipeNutritionalValue(value.foodOrRecipeId);
                  if (recipe.isFailure) throw new Error(recipe.err as unknown as string);
                  return {
                     date: value.date,
                     foodOrRecipeId: value.foodOrRecipeId,
                     isRecipe: value.isRecipe,
                     quantity: value.quantity,
                     defaultQuantity: recipe.val.quantity,
                     nutrients: recipe.val.nutrients,
                  };
               } else {
                  const foods = await (await FoodAndRecipeApi.getInstance()).getFoodNutritionalValue(value.foodOrRecipeId);
                  if (foods.isFailure) throw new Error(foods.err as unknown as string);
                  return {
                     date: value.date,
                     foodOrRecipeId: value.foodOrRecipeId,
                     isRecipe: value.isRecipe,
                     quantity: value.quantity,
                     defaultQuantity: foods.val.quantity,
                     nutrients: foods.val.nutrients,
                  };
               }
            }),
         );
         return Result.ok<IntakeSecondaryData[]>(intakeData);
      } catch (error) {
         return Result.fail<IntakeSecondaryData[]>(error as string);
      }
   }

   private generateIntakeProps(intakeSecondaryData: IntakeSecondaryData[]): CreateIntakeDataProps[] {
      return intakeSecondaryData.map((value: IntakeSecondaryData) => {
         const { quantity, defaultQuantity, nutrients, ...otherProps } = value;
         const newNutrients = nutrients.map((nutrientValue: NutritionalValue) => ({
            value: (quantity.value * nutrientValue.value) / defaultQuantity.value,
            unit: nutrientValue.unit,
            tagname: nutrientValue.tagname,
         }));
         return { ...otherProps, nutrients: newNutrients };
      });
   }
}
