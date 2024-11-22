import { Message, AggregateID, AppServiceResponse } from "@shared";
import {
   CreateRecipeRequest,
   DeleteRecipeRequest,
   GetAllRecipeRequest,
   GetRecipeByIdRequest,
   GetRecipeNutritionnalValueRequest,
   NutritionalValue,
} from "./../../useCases";
import { RecipeDto } from "./../../../infrastructure";
export interface IRecipeService {
   createRecipe(req: CreateRecipeRequest): Promise<AppServiceResponse<AggregateID> | Message>;
   deleteRecipe(req: DeleteRecipeRequest): Promise<AppServiceResponse<boolean> | Message>;
   getRecipeById(req: GetRecipeByIdRequest): Promise<AppServiceResponse<RecipeDto> | Message>;
   getAllRecipe(req: GetAllRecipeRequest): Promise<AppServiceResponse<RecipeDto[]> | Message>;
   getRecipeNutritionnalValue(
      req: GetRecipeNutritionnalValueRequest,
   ): Promise<AppServiceResponse<{ recipeId: AggregateID; nutrients: NutritionalValue[] }> | Message>;
}
