import { Either, Result } from "@/core/shared";
import { CreatePatientProfilErrors } from "./CreatePatientProfilErrors";

export type CreatePatientProfilResponse = Either<
   CreatePatientProfilErrors.PatientProfilRepoError | CreatePatientProfilErrors.PatientProfilFactoryError,
   Result<void>
>;
