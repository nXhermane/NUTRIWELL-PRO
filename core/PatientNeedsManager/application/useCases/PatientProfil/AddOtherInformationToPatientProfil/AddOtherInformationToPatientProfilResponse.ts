import { AppError, Either, Result } from "@/core/shared";
import { AddOtherInformationToPatientProfilErrors } from "./AddOtherInformationToPatientProfilErrors";

export type AddOtherInformationToPatientProfilResponse = Either<
   AddOtherInformationToPatientProfilErrors.PatientProfilRepoError | AppError.UnexpectedError,
   Result<void>
>;
