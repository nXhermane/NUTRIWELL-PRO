import { AggregateID, Either, Result, AppError } from "@shared";
import { GetFoodDiaryErrors } from "./GetFoodDiaryErrors";
import { FoodDiaryDto } from "./../../../../infrastructure";
export type GetFoodDiaryResponse = Either<AppError.UnexpectedError | GetFoodDiaryErrors.MedicalRecordNotFoundError, Result<FoodDiaryDto>>;
