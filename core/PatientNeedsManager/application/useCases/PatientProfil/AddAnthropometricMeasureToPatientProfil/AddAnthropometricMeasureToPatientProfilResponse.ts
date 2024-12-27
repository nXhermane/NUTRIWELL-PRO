import { AppError, Either, Result } from "@/core/shared";
import { AddAnthropometricMeasureToPatientProfilErrors } from "./AddAnthropometricMeasureToPatientProfilErrors";

export type AddAnthropometricMeasureToPatientProfilResponse = Either<
   | AddAnthropometricMeasureToPatientProfilErrors.PatientProfilRepoError
   | AddAnthropometricMeasureToPatientProfilErrors.DataValidationError
   | AppError.UnexpectedError,
   Result<void>
>;
