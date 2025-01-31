import { AppError, Either, Result } from "@/core/shared";
import { RemoveHealthMetricFromPatientProfilErrors } from "./RemoveHealthMetricFromPatientProfilErrors";

export type RemoveHealthMetricFromPatientProfilResponse = Either<
   RemoveHealthMetricFromPatientProfilErrors.PatientProfilRepoError | AppError.UnexpectedError,
   Result<void>
>;
