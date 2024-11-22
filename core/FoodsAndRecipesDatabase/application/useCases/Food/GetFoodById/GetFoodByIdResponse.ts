import { Result, Either, AppError } from "@shared";
import { FoodDto } from "./../../../../infrastructure";
import { GetFoodByIdErrors } from "./GetFoodByIdErrors";

export type GetFoodByIdResponse = Either<GetFoodByIdErrors.FoodNotFoundError | AppError.UnexpectedError, Result<FoodDto>>;
