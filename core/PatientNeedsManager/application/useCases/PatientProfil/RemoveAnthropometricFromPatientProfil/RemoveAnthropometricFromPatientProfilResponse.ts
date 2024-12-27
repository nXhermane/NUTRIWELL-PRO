import { AppError, Either, Result } from "@/core/shared";
import { RemoveAnthropometricFromPatientProfilErrors } from "./RemoveAnthropometricFromPatientProfilErrors";

export type RemoveAnthropometricFromPatientProfilResponse = Either<
   RemoveAnthropometricFromPatientProfilErrors.PatientProfilRepoError | AppError.UnexpectedError,
   Result<void>
>;
