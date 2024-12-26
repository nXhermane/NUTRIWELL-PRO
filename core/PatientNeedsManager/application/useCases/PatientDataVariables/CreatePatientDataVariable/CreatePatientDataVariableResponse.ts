import { AppError, Either, Result } from "@/core/shared";
import { CreatePatientDataVariableErrors } from "./CreatePatientDataVariableErrors";

export type CreatePatientDataVariableResponse = Either<
   | AppError.UnexpectedError
   | CreatePatientDataVariableErrors.PatientDataVariableFactoryError
   | CreatePatientDataVariableErrors.PatientDataVariableRepoError,
   Result<void>
>;
