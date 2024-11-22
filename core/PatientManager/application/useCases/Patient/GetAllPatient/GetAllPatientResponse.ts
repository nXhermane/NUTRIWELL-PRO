import { Either, Result, AppError } from "@shared";
import { GetAllPatientErrors } from "./GetAllPatientErrors";
import { PatientDto } from "./../../../../infrastructure";
export type GetAllPatientResponse = Either<AppError.UnexpectedError | GetAllPatientErrors.PatientRepoError, Result<PatientDto[]>>;
