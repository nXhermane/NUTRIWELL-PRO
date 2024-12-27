import { AppError, Either, Result } from "@/core/shared";
import { RemoveMedicalAnalyseMeasureFromPatientProfilErrors } from "./RemoveMedicalAnalyseMeasureFromPatientProfilErrors";

export type RemoveMedicalAnalyseMeasureFromPatientProfilResponse = Either<
   RemoveMedicalAnalyseMeasureFromPatientProfilErrors.PatientProfilRepoError | AppError.UnexpectedError,
   Result<void>
>;
