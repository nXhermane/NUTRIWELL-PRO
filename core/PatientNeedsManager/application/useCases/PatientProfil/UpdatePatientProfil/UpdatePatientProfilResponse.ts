import { AppError, Either, Result } from "@/core/shared";
import { UpdatePatientProfilErrors } from "./UpdatePatientProfilErrors";

export type UpdatePatientProfilResponse = Either<
   | UpdatePatientProfilErrors.PatientProfilNotFoundError
   | UpdatePatientProfilErrors.PatientProfilRepoError
   | UpdatePatientProfilErrors.DataValidationError
   | AppError.UnexpectedError,
   Result<void>
>;
