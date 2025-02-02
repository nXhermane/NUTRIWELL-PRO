import { SQLiteDatabase } from "expo-sqlite";
import { IFoodRecipeServiceDataProvider } from "./interfaces/FoodRecipeServiceDataProvider";
import { db } from "../../infrastructure/database/db.config";
import { FoodGroupRepositoryImpl, FoodRepositoryImpl, NutrientRepositoryImpl, RecipeRepositoryImpl } from "../../infrastructure/repositories";
import { FoodGroupMapper } from "./../../infrastructure/mappers/FoodGroupMapper";
import { FoodMapper } from "./../../infrastructure/mappers/FoodMapper";
import { NutrientMapper } from "./../../infrastructure/mappers/NutrientMapper";
import { RecipeMapper } from "./../../infrastructure/mappers/RecipeMapper";
import { FoodRecipeServiceDataProvider } from "./FoodRecipeServiceDataProvider";
import { GetRecipeNutritionnalValueUseCase } from "../useCases";
import { NutritionCalculatorService } from "../../domain/services/NutritionCalculatorService";

export class FoodAndRecipeApi {
   private static instance: IFoodRecipeServiceDataProvider | null = null;
   static async getInstance(): Promise<IFoodRecipeServiceDataProvider> {
      if (!FoodAndRecipeApi.instance) {
         const expo: SQLiteDatabase = (await db).db as SQLiteDatabase;
         const foodMapper = new FoodMapper();
         const recipeMapper = new RecipeMapper();
         const nutrientMapper = new NutrientMapper();
         const foodGroupMapper = new FoodGroupMapper();
         const foodGroupRepo = new FoodGroupRepositoryImpl(expo as SQLiteDatabase, foodGroupMapper);
         const foodRepo = new FoodRepositoryImpl(expo as SQLiteDatabase, foodMapper, foodGroupRepo);
         const recipeRepo = new RecipeRepositoryImpl(expo as SQLiteDatabase, recipeMapper);
         const nutrientRepo = new NutrientRepositoryImpl(expo, nutrientMapper);
         const recipeNutritionalValueUC = new GetRecipeNutritionnalValueUseCase(recipeRepo, new NutritionCalculatorService(foodRepo), nutrientRepo);
         FoodAndRecipeApi.instance = new FoodRecipeServiceDataProvider(
            foodRepo,
            recipeRepo,
            nutrientRepo,
            foodMapper,
            recipeMapper,
            nutrientMapper,
            recipeNutritionalValueUC,
         );
      }
      return FoodAndRecipeApi.instance;
   }
}
