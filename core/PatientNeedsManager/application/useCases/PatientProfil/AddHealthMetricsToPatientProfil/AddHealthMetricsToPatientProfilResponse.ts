import { AppError, Either, Result } from "@/core/shared";
import { AddHealthMetricsToPatientProfilErrors } from "./AddHealthMetricsToPatientProfilErrors";

export type AddHealthMetricsToPatientProfilResponse = Either<
   | AddHealthMetricsToPatientProfilErrors.PatientProfilRepoError
   | AddHealthMetricsToPatientProfilErrors.DataValidationError
   | AppError.UnexpectedError,
   Result<void>
>;
