import { GetRecipeNutritionnalValueErrors } from "./GetRecipeNutritionnalValueErrors";
import { GetRecipeNutritionnalValueRequest } from "./GetRecipeNutritionnalValueRequest";
import { GetRecipeNutritionnalValueResponse, NutritionalValue } from "./GetRecipeNutritionnalValueResponse";
import { UseCase, AppError, Result, left, right, AggregateID, IQuantity } from "@shared";
import { NutrientRepository, RecipeRepository, RecipeRepositoryNotFoundException } from "./../../../../infrastructure";
import { INutrientAmount, INutritionCalculatorService } from "./../../../../domain";

export class GetRecipeNutritionnalValueUseCase implements UseCase<GetRecipeNutritionnalValueRequest, GetRecipeNutritionnalValueResponse> {
   constructor(
      private repo: RecipeRepository,
      private service: INutritionCalculatorService,
      private nutRepo: NutrientRepository,
   ) {}

   async execute(request: GetRecipeNutritionnalValueRequest): Promise<GetRecipeNutritionnalValueResponse> {
      try {
         const recipe = await this.repo.getRecipeById(request.recipeId);
         const nutrients = await Promise.all(
            (await this.service.calculateRecipeNutritionalValue(recipe)).map(async (nutrient: INutrientAmount) => {
               const nut = await this.nutRepo.getById(nutrient.nutrientId);
               return { name: nut.nutrientNameE, nameF: nut.nutrientNameF, tagname: nut.nutrientINFOODSTagName, unit: nut.nutrientUnit, ...nutrient };
            }),
         );
         return right(
            Result.ok<{ recipeId: AggregateID; nutrients: NutritionalValue[],quantity:IQuantity }>({
               recipeId: request.recipeId,
               nutrients: nutrients as NutritionalValue[],
               quantity: recipe.quantity,
            }),
         );
      } catch (e) {
         if (e instanceof RecipeRepositoryNotFoundException) {
            return left(new GetRecipeNutritionnalValueErrors.RecipeNotFoundError(e, request.recipeId));
         } else {
            return left(new AppError.UnexpectedError(e));
         }
      }
   }
}
