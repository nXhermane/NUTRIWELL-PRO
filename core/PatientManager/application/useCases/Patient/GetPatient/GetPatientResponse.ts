import { Result, AppError, Either } from "@shared";
import { GetPatientErrors } from "./GetPatientErrors";
import { PatientDto } from "./../../../../infrastructure";
export type GetPatientResponse = Either<AppError.UnexpectedError | GetPatientErrors.PatientNotFoundError, Result<PatientDto>>;
