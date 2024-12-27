import { AppError, Either, Result } from "@/core/shared";
import { RemoveBodyCompositionMeasureFromPatientProfilErrors } from "./RemoveBodyCompositionMeasureFromPatientProfilErrors";

export type RemoveBodyCompositionMeasureFromPatientProfilRespone = Either<
   RemoveBodyCompositionMeasureFromPatientProfilErrors.PatientProfilRepoError | AppError.UnexpectedError,
   Result<void>
>;
