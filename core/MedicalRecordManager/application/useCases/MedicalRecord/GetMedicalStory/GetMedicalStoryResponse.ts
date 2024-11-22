import { AggregateID, Result, Either, AppError } from "@shared";
import { MedicalStoryDto } from "./../../../../infrastructure";
import { GetMedicalStoryErrors } from "./GetMedicalStoryErrors";
export type GetMedicalStoryResponse = Either<AppError.UnexpectedError | GetMedicalStoryErrors.MedicalRecordNotFoundError, Result<MedicalStoryDto>>;
