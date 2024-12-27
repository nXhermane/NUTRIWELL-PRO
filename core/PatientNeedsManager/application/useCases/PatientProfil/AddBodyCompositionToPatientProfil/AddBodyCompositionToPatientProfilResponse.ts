import { AppError, Either, Result } from "@/core/shared";
import { AddBodyCompositionToPatientProfilErrors } from "./AddBodyCompositionToPatientProfilErrors";

export type AddBodyCompositionToPatientProfilResponse = Either<
   | AddBodyCompositionToPatientProfilErrors.DataValidationError
   | AddBodyCompositionToPatientProfilErrors.PatientProfilRepoError
   | AppError.UnexpectedError,
   Result<void>
>;
