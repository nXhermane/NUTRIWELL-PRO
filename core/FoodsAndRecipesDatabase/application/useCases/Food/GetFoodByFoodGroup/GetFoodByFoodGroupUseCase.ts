import { GetFoodByFoodGroupRequest } from "./GetFoodByFoodGroupRequest";
import { GetFoodByFoodGroupResponse } from "./GetFoodByFoodGroupResponse";
import { GetFoodByFoodGroupErrors } from "./GetFoodByFoodGroupErrors";
import { UseCase, Mapper, Result, AppError, left, right } from "@shared";
import { FoodDto, FoodNamePersistenceType, FoodRepository, FoodRepositoryError, FoodRepositoryNotFoundException } from "./../../../../infrastructure";
import { Food } from "./../../../../domain";

export class GetFoodByFoodGroupUseCase implements UseCase<GetFoodByFoodGroupRequest, GetFoodByFoodGroupResponse> {
   constructor(
      private repo: FoodRepository,
      private mapper: Mapper<Food, FoodNamePersistenceType, FoodDto>,
   ) {}

   async execute(request: GetFoodByFoodGroupRequest): Promise<GetFoodByFoodGroupResponse> {
      try {
         const foods = await this.repo.getByFoodGroupId(request.foodGroupId, request?.paginated);
         return right(Result.ok<FoodDto[]>(foods.map((food: Food) => this.mapper.toResponse(food))));
      } catch (e) {
         if (e instanceof FoodRepositoryNotFoundException) {
            return right(Result.ok<FoodDto[]>([]));
         } else if (e instanceof FoodRepositoryError) {
            return left(new GetFoodByFoodGroupErrors.FoodRepositoryError(e.toJSON()));
         } else {
            return left(new AppError.UnexpectedError(e));
         }
      }
   }
}
