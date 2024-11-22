import { AggregateID, Result, Either, AppError } from "@shared";
import { GetAllFoodDiaryErrors } from "./GetAllFoodDiaryErrors";
import { FoodDiaryDto } from "./../../../../infrastructure";
export type GetAllFoodDiaryResponse = Either<AppError.UnexpectedError | GetAllFoodDiaryErrors.MedicalRecordNotFoundError, Result<FoodDiaryDto[]>>;
