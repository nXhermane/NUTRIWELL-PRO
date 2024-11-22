import { AggregateID, Result, Either, AppError } from "@shared";
import { GetAllObjectiveErrors } from "./GetAllObjectiveErrors";
import { ObjectiveDto } from "./../../../../infrastructure";
export type GetAllObjectiveResponse = Either<AppError.UnexpectedError | GetAllObjectiveErrors.MedicalRecordNotFoundError, Result<ObjectiveDto[]>>;
