import { IFoodService } from "./interfaces/FoodService";
import {
   GetFoodByIdRequest,
   GetFoodByIdResponse,
   GetAllFoodRequest,
   GetFoodByFoodGroupRequest,
   GetFoodByFoodGroupResponse,
   SearchFoodResponse,
   SearchFoodRequest,
   GetAllFoodResponse,
} from "./../useCases";
import { Message, UseCase, AppServiceResponse } from "@shared";
import { FoodDto } from "../../infrastructure";

export class FoodService implements IFoodService {
   constructor(
      private getFoodByIdUC: UseCase<GetFoodByIdRequest, GetFoodByIdResponse>,
      private getAllFoodUC: UseCase<GetAllFoodRequest, GetAllFoodResponse>,
      private getFoodByGroupUC: UseCase<GetFoodByFoodGroupRequest, GetFoodByFoodGroupResponse>,
      private searchFoodUC: UseCase<SearchFoodRequest, SearchFoodResponse>,
   ) {}

   async getFoodById(req: GetFoodByIdRequest): Promise<AppServiceResponse<FoodDto> | Message> {
      const res = await this.getFoodByIdUC.execute(req);
      if (res.isLeft()) {
         return new Message("error", JSON.stringify(res.value.err));
      } else {
         return { data: res.value.val as FoodDto };
      }
   }
   async getAllFood(req: GetAllFoodRequest): Promise<AppServiceResponse<FoodDto[]> | Message> {
      const res = await this.getAllFoodUC.execute(req);
      if (res.isLeft()) {
         return new Message("error", JSON.stringify(res.value.err));
      } else {
         return { data: res.value.val as FoodDto[] };
      }
   }
   async getFoodByGroupId(req: GetFoodByFoodGroupRequest): Promise<AppServiceResponse<FoodDto[]> | Message> {
      const res = await this.getFoodByGroupUC.execute(req);
      if (res.isLeft()) {
         return new Message("error", JSON.stringify(res.value.err));
      } else {
         return { data: res.value.val as FoodDto[] };
      }
   }
   async search(req: SearchFoodRequest): Promise<AppServiceResponse<FoodDto[]> | Message> {
      const res = await this.searchFoodUC.execute(req);
      if (res.isLeft()) {
         return new Message("error", JSON.stringify(res.value.err));
      } else {
         return { data: res.value.val as FoodDto[] };
      }
   }
}
