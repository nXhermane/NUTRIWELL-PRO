import { AppError, Either, Result } from "@/core/shared";
import { GetPatientDataVariableErrors } from "./GetPatientDataVariableErrors";
import { PatientDataVariableDto } from "@/core/PatientNeedsManager/infrastructure";

export type GetPatientDataVariableResponse = Either<AppError.UnexpectedError | GetPatientDataVariableErrors.PatientDataVariableNotFoundError, Result<PatientDataVariableDto>>