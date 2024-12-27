import { AppError, Either, Result } from "@/core/shared";
import { AddMedicalAnalyseToPatientProfilErrors } from "./AddMedicalAnalyseToPatientProfilErros";

export type AddMedicalAnalyseToPatientProfilResponse = Either<
   | AddMedicalAnalyseToPatientProfilErrors.DataValidationError
   | AddMedicalAnalyseToPatientProfilErrors.PatientProfilRepoError
   | AppError.UnexpectedError,
   Result<void>
>;
