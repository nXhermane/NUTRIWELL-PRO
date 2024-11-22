import { Result, AppError, Either } from "@shared";
import { DeletePatientErrors } from "./DeletePatientErrors";
export type DeletePatientResponse = Either<AppError.UnexpectedError | DeletePatientErrors.PatientNotFoundError, Result<boolean>>;
