import {
   IFoodService,
   FoodService,
   RecipeService,
   IRecipeService,
   GetAllFoodUseCase,
   GetFoodByFoodGroupUseCase,
   GetFoodByIdUseCase,
   SearchFoodUseCase,
   CreateRecipeUseCase,
   DeleteRecipeUseCase,
   GetAllRecipeUseCase,
   GetRecipeByIdUseCase,
   GetRecipeNutritionnalValueUseCase,
   FoodRecipeServiceDataProvider,
   IFoodRecipeServiceDataProvider,
   FoodRecipeServiceDataProviderError,
   FoodAndRecipeApi,
} from "./application";
import { NutritionCalculatorService } from "./domain";
import {
   FoodMapper,
   FoodRepositoryImpl,
   RecipeRepositoryImpl,
   RecipeMapper,
   NutrientRepositoryImpl,
   NutrientMapper,
   FoodGroupMapper,
   FoodGroupRepositoryImpl,
   FoodDto,
} from "./infrastructure";
import { SearchEngine } from "@shared";
import { db } from "./infrastructure/database/db.config";
import { SQLiteDatabase } from "expo-sqlite";
export interface IFoodAndRecipe {
   food: IFoodService;
   recipe: IRecipeService;
   api: {
      foodAndRecipeDataProvider: IFoodRecipeServiceDataProvider;
   };
}

export class FoodAndRecipe {
   private static instance: IFoodAndRecipe | null = null;

   static async getInstance(): Promise<IFoodAndRecipe> {
      if (FoodAndRecipe.instance === null) {
         const expo = (await db).db;
         const foodMapper = new FoodMapper();
         const recipeMapper = new RecipeMapper();
         const nutrientMapper = new NutrientMapper();
         const foodGroupMapper = new FoodGroupMapper();
         const nutrientRepo = new NutrientRepositoryImpl(expo as SQLiteDatabase, nutrientMapper);
         const foodGroupRepo = new FoodGroupRepositoryImpl(expo as SQLiteDatabase, foodGroupMapper);
         const foodRepo = new FoodRepositoryImpl(expo as SQLiteDatabase, foodMapper, foodGroupRepo);
         const recipeRepo = new RecipeRepositoryImpl(expo as SQLiteDatabase, recipeMapper);

         const searchEngine = new SearchEngine<FoodDto>([], {
            keys: "foodName",
         });

         const getFoodByIdUC = new GetFoodByIdUseCase(foodRepo, foodMapper);
         const getAllFoodUC = new GetAllFoodUseCase(foodRepo, foodMapper);
         const getFoodByGroupUC = new GetFoodByFoodGroupUseCase(foodRepo, foodMapper);
         const searchFoodUC = new SearchFoodUseCase(foodRepo, foodMapper, searchEngine);

         const foodService = new FoodService(getFoodByIdUC, getAllFoodUC, getFoodByGroupUC, searchFoodUC);

         const nutritionCalculator = new NutritionCalculatorService(foodRepo);

         const createRecipeUC = new CreateRecipeUseCase(recipeRepo);
         const deleteRecipeUC = new DeleteRecipeUseCase(recipeRepo);
         const getRecipeByIdUC = new GetRecipeByIdUseCase(recipeRepo, recipeMapper);

         const getAllRecipeUC = new GetAllRecipeUseCase(recipeRepo, recipeMapper);

         const getRecipeNutritionnalValueUC = new GetRecipeNutritionnalValueUseCase(recipeRepo, nutritionCalculator, nutrientRepo);
         const recipeService = new RecipeService(createRecipeUC, deleteRecipeUC, getRecipeByIdUC, getAllRecipeUC, getRecipeNutritionnalValueUC);
         this.instance = {
            food: foodService,
            recipe: recipeService,
            api: { foodAndRecipeDataProvider: await FoodAndRecipeApi.getInstance() },
         };
      }
      return this.instance as IFoodAndRecipe;
   }
}

export { IFoodRecipeServiceDataProvider };
