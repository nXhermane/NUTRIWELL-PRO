import { AggregateID, Result, Either, AppError } from "@shared";
import { ObjectiveDto } from "./../../../../infrastructure";
import { GetObjectiveErrors } from "./GetObjectiveErrors";
export type GetObjectiveResponse = Either<AppError.UnexpectedError | GetObjectiveErrors.MedicalRecordNotFoundError, Result<ObjectiveDto>>;
