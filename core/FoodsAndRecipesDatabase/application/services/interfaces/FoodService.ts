import { FoodDto } from "./../../../infrastructure";
import { GetFoodByIdRequest, GetAllFoodRequest, GetFoodByFoodGroupRequest, SearchFoodRequest } from "./../../useCases";
import { Message, AppServiceResponse } from "@shared";

export interface IFoodService {
   getFoodById(req: GetFoodByIdRequest): Promise<AppServiceResponse<FoodDto> | Message>;
   getAllFood(req: GetAllFoodRequest): Promise<AppServiceResponse<FoodDto[]> | Message>;
   getFoodByGroupId(req: GetFoodByFoodGroupRequest): Promise<AppServiceResponse<FoodDto[]> | Message>;
   search(req: SearchFoodRequest): Promise<AppServiceResponse<FoodDto[]> | Message>;
}
