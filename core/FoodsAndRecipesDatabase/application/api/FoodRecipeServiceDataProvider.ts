import {
   RecipeRepository,
   FoodRepository,
   FoodRepositoryNotFoundException,
   RecipeRepositoryNotFoundException,
   RecipeRepositoryError,
   FoodRepositoryError,
   FoodDto,
   RecipeDto,
   FoodMapper,
   RecipeMapper,
   NutrientDto,
   NutrientMapper,
   NutrientRepository,
} from "./../../infrastructure";
import { IFoodRecipeServiceDataProvider } from "./interfaces/FoodRecipeServiceDataProvider";
import { FoodRecipeServiceDataProviderError } from "./errors/FoodRecipeServiceDataProviderError";
import { AggregateID, IQuantity, Result, UseCase } from "@shared";
import { Food, IMealsType, INutrientAmount, INutritionCalculatorService, Nutrient, Recipe } from "./../../domain";
import { GetRecipeNutritionnalValueRequest, GetRecipeNutritionnalValueResponse, NutritionalValue } from "../useCases";
export type RecipeNutritionalValue = {
   recipeId: AggregateID;
   nutrients: NutritionalValue[];
   quantity: IQuantity;
};
export type FoodNutritionalValue = {
   foodId: AggregateID;
   nutrients: NutritionalValue[];
   quantity: IQuantity;
};
export class FoodRecipeServiceDataProvider implements IFoodRecipeServiceDataProvider {
   constructor(
      private foodRepo: FoodRepository,
      private recipeRepo: RecipeRepository,
      private nutrientRepo: NutrientRepository,
      private foodMapper: FoodMapper,
      private recipeMapper: RecipeMapper,
      private nutrientMapper: NutrientMapper,
      private getRecipeNutritionalValueUC: UseCase<GetRecipeNutritionnalValueRequest, GetRecipeNutritionnalValueResponse>,
   ) {}
   async getFoodById(...foodIds: (string | number)[]): Promise<Result<FoodDto[]>> {
      try {
         const foods = await Promise.all(foodIds.map((foodId: AggregateID) => this.foodRepo.getById(foodId)));
         return Result.ok<FoodDto[]>(foods.map((food: Food) => this.foodMapper.toResponse(food)));
      } catch (error) {
         return Result.fail<FoodDto[]>(`[Error]:${(error as any).toJSON() || error}`);
      }
   }
   async getRecipeById(...recipeIds: (string | number)[]): Promise<Result<RecipeDto[]>> {
      try {
         const recipes = await Promise.all(recipeIds.map((recipeId: AggregateID) => this.recipeRepo.getRecipeById(recipeId)));
         return Result.ok<RecipeDto[]>(recipes.map((recipe: Recipe) => this.recipeMapper.toResponse(recipe)));
      } catch (error) {
         return Result.fail<RecipeDto[]>(`[Error]:${(error as any).toJSON() || error}`);
      }
   }
   async getAllNutrient(): Promise<Result<NutrientDto[]>> {
      try {
         const nutrients = await this.nutrientRepo.getAllNutrient();
         return Result.ok<NutrientDto[]>(nutrients.map((nutrient: Nutrient) => this.nutrientMapper.toResponse(nutrient)));
      } catch (error) {
         return Result.fail<NutrientDto[]>(`[Error]:${(error as any).toJSON() || error}`);
      }
   }
   async getRecipeNutritionalValue(recipeId: AggregateID): Promise<Result<RecipeNutritionalValue>> {
      const recipeNutritionalValue = await this.getRecipeNutritionalValueUC.execute({ recipeId });
      if (recipeNutritionalValue.isLeft()) return Result.fail<RecipeNutritionalValue>(recipeNutritionalValue.value.err.message);
      return Result.ok<RecipeNutritionalValue>(recipeNutritionalValue.value.val);
   }
   async getFoodNutritionalValue(foodId: AggregateID): Promise<Result<FoodNutritionalValue>> {
      try {
         const food = await this.foodRepo.getById(foodId);
         const nutrientValues = await Promise.all(
            food.foodNutrients.map(async (value: INutrientAmount) => {
               const nutrientInfo = await this.nutrientRepo.getById(value.nutrientId);
               return {
                  nutrientId: value.nutrientId,
                  value: value.value,
                  originalValue: value.originalValue,
                  name: nutrientInfo.nutrientNameE,
                  nameF: nutrientInfo.nutrientNameF,
                  tagname: nutrientInfo.nutrientINFOODSTagName,
                  unit: nutrientInfo.nutrientUnit,
               };
            }),
         );

         return Result.ok<FoodNutritionalValue>({
            foodId: food.id,
            nutrients: nutrientValues,
            quantity: food.foodQuantity,
         });
      } catch (error) {
         return Result.fail<FoodNutritionalValue>(error as string);
      }
   }
   async getAllFoodIds(): Promise<AggregateID[]> {
      try {
         const foodIds = await this.foodRepo.getAllFoodId();
         return foodIds;
      } catch (e) {
         if (e instanceof FoodRepositoryNotFoundException) {
            return [] as AggregateID[];
         } else if (e instanceof FoodRepositoryError) {
            throw new FoodRecipeServiceDataProviderError(e.message, e as Error, e.metadata);
         } else {
            throw new FoodRecipeServiceDataProviderError(`Unexpected error: ${e?.constructor.name}`, e as Error);
         }
      }
   }
   async getAllRecipeIds(): Promise<AggregateID[]> {
      try {
         const recipeIds = await this.recipeRepo.getAllRecipeId();
         return recipeIds;
      } catch (e) {
         if (e instanceof RecipeRepositoryNotFoundException) {
            return [] as AggregateID[];
         } else if (e instanceof RecipeRepositoryError) {
            throw new FoodRecipeServiceDataProviderError(e.message, e as Error, e.metadata);
         } else {
            throw new FoodRecipeServiceDataProviderError(`Unexpected error: ${e?.constructor.name}`, e as Error);
         }
      }
   }
   async getAllMealTypeIds(): Promise<AggregateID[]> {
      try {
         const mealTypes = await this.recipeRepo.getAllRecipeType();
         return mealTypes.map((mealType: IMealsType) => mealType.typeId);
      } catch (e) {
         if (e instanceof RecipeRepositoryNotFoundException) {
            return [] as AggregateID[];
         } else if (e instanceof RecipeRepositoryError) {
            throw new FoodRecipeServiceDataProviderError(e.message, e as Error, e.metadata);
         } else {
            throw new FoodRecipeServiceDataProviderError(`Unexpected error: ${e?.constructor.name}`, e as Error);
         }
      }
   }
}
