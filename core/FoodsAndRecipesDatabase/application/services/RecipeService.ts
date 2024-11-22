import { Message, UseCase, AppServiceResponse, AggregateID } from "@shared";
import {
   CreateRecipeRequest,
   CreateRecipeResponse,
   DeleteRecipeRequest,
   DeleteRecipeResponse,
   GetAllRecipeRequest,
   GetAllRecipeResponse,
   GetRecipeByIdRequest,
   GetRecipeByIdResponse,
   GetRecipeNutritionnalValueRequest,
   GetRecipeNutritionnalValueResponse,
   NutritionalValue
} from "./../useCases";
import { IRecipeService } from "./interfaces/RecipeService";
import { RecipeDto } from "../../infrastructure";
export class RecipeService implements IRecipeService {
   constructor(
      private createUC: UseCase<CreateRecipeRequest, CreateRecipeResponse>,
      private deleteUC: UseCase<DeleteRecipeRequest, DeleteRecipeResponse>,
      private getByIdUC: UseCase<GetRecipeByIdRequest, GetRecipeByIdResponse>,
      private getAllUC: UseCase<GetAllRecipeRequest, GetAllRecipeResponse>,
      private getNutritionnalValueUC: UseCase<GetRecipeNutritionnalValueRequest, GetRecipeNutritionnalValueResponse>,
   ) {}
   async createRecipe(req: CreateRecipeRequest): Promise<AppServiceResponse<AggregateID> | Message> {
      const res = await this.createUC.execute(req);
      if (res.isLeft()) {
         return new Message("error", JSON.stringify(res.value.err));
      } else {
         return { data: res.value.val as AggregateID };
      }
   }
   async deleteRecipe(req: DeleteRecipeRequest): Promise<AppServiceResponse<boolean> | Message> {
      const res = await this.deleteUC.execute(req);
      if (res.isLeft()) {
         return new Message("error", JSON.stringify(res.value.err));
      } else {
         return { data: res.value.val as boolean };
      }
   }
   async getRecipeById(req: GetRecipeByIdRequest): Promise<AppServiceResponse<RecipeDto> | Message> {
      const res = await this.getByIdUC.execute(req);
      if (res.isLeft()) {
         return new Message("error", JSON.stringify(res.value.err));
      } else {
         return { data: res.value.val as RecipeDto };
      }
   }

   async getAllRecipe(req: GetAllRecipeRequest): Promise<AppServiceResponse<RecipeDto[]> | Message> {
      const res = await this.getAllUC.execute(req);
      if (res.isLeft()) {
         return new Message("error", JSON.stringify(res.value.err));
      } else {
         return { data: res.value.val as RecipeDto[] };
      }
   }
   async getRecipeNutritionnalValue(
      req: GetRecipeNutritionnalValueRequest,
   ): Promise<AppServiceResponse<{ recipeId: AggregateID; nutrients: NutritionalValue[] }> | Message> {
      const res = await this.getNutritionnalValueUC.execute(req);
      if (res.isLeft()) {
         return new Message("error", JSON.stringify(res.value.err));
      } else {
         return { data: res.value.val as { recipeId: AggregateID; nutrients: NutritionalValue[] } };
      }
   }
}
