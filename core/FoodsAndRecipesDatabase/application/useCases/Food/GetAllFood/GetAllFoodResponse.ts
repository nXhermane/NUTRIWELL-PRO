import { FoodDto } from "./../../../../infrastructure";
import { GetAllFoodErrors } from "./GetAllFoodErrors";
import { Either, AppError, Result } from "@shared";
export type GetAllFoodResponse = Either<AppError.UnexpectedError | GetAllFoodErrors.FoodRepositoryError, Result<FoodDto[]>>;
