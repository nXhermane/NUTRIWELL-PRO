import { IQuantity } from "@shared";
import { FoodGroup, IFoodGroup, IMealsCategory, IMealsType } from "../../domain";
import { INutrientAmount } from "../../domain/value-objects/NutrientAmount";
import { RecipePersistenceDto } from "./../dtos/RecipePersistenceDto";
export interface Timestamp {
   createdAt: string;
   updatedAt: string;
}
export interface IngredientType {
   name: string;
   quantity: IQuantity;
   foodId: string | number;
}
export interface PreparationStepType {
   stepNumber: number;
   description: string;
   estimatedTime?: number;
}
export interface FoodNamePersistenceType extends Timestamp {
   foodId: string;
   foodCode: string;
   groupId: string;
   foodName: string;
   foodNameF: string;
   scientificName?: string;
   foodSource: string;
   foodOrigin: string;
   foodNutrients: NutrientAmountPersitenceType[];
}

export interface FoodGroupPersistenceType extends Timestamp {
   groupId: string;
   groupCode: string;
   groupName: string;
   groupNameF: string;
}

export interface NutrientAmountPersitenceType {
   nutrientId: string;
   nutrientValue: number;
   originalValue?: string;
}

export interface NutrientName {
   nutrientNameId: string;
   nutrientName: string;
   nutrientNameF: string;
   nutrientCode: string;
   nutrientUnit: string;
   nutrientSymbol?: string;
   tagname: string;
   nutrientDecimal: string;
}

export interface RecipePersistenceType {
   recipeId: string;
   name: string;
   nameF: string;
   categoryId: string;
   typeId: string;
   ingredients: IngredientType[];
   preparationMethod: PreparationStepType[];
   cookingTime: number;
   quantity: IQuantity;
   description: string;
   author: string;
   createdAt: string;
   updatedAt: string;
}
export interface RecipePersistenceRecordType extends Omit<RecipePersistenceType, "categoryId" | "typeId"> {
   category: IMealsCategory;
   type: IMealsType;
}

export interface FoodPersistenceType extends Omit<FoodNamePersistenceType, "foodGroupId"> {
   foodGroup: FoodGroup;
}
export type NutrientPersistenceArray = [
   nutrientValue: number,
   nutrientId: number,
   originalValue: string,
   nutrientName: string,
   nutrientNameF: string,
   nutrientCode: string,
   tagname: string,
   nutrientUnit: string,
   nutrientDecimal: number,
];
export interface NutrientPersistenceType extends Timestamp {
   nutrientId: string;
   nutrientCode: string;
   nutrientDecimal: string;
   nutrientName: string;
   nutrientNameF: string;
   nutrientUnit: string;
   tagname: string;
   nutrientSymbol: string;
}
