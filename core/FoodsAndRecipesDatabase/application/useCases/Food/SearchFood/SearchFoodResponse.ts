import { FoodDto } from "./../../../../infrastructure";
import { AppError, Result, Either } from "@shared";
export type SearchFoodResponse = Either<AppError.UnexpectedError, Result<FoodDto[]>>;
