import { Either, AppError, Result } from "@shared";
import { GetFoodByFoodGroupErrors } from "./GetFoodByFoodGroupErrors";
import { FoodDto } from "./../../../../infrastructure";
export type GetFoodByFoodGroupResponse = Either<AppError.UnexpectedError | GetFoodByFoodGroupErrors.FoodRepositoryError, Result<FoodDto[]>>;
