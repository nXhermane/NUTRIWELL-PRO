import { AppError, Either, Result } from "@/core/shared";
import { AddVariableToPatientDataVariableErrors } from "./AddVariableToPatientDataVariableErrors";

export type AddVariableToPatientDataVariableResponse = Either<
   AddVariableToPatientDataVariableErrors.PatientDataVariableNotFoundError | AppError.UnexpectedError,
   Result<void>
>;
