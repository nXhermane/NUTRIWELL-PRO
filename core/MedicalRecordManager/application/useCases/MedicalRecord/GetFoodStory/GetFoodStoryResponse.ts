import { AggregateID, Result, AppError, Either } from "@shared";
import { GetFoodStoryErrors } from "./GetFoodStoryErrors";
import { FoodStoryDto } from "./../../../../infrastructure";
export type GetFoodStoryResponse = Either<AppError.UnexpectedError | GetFoodStoryErrors.MedicalRecordNotFoundError, Result<FoodStoryDto>>;
