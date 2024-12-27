import { AppError, Either, Result } from "@/core/shared";
import { GetPatientProfilErrors } from "./GetPatientProfilErrors";
import { PatientProfilDto } from "../../../../infrastructure/dtos/PatientProfilDto";

export type GetPatientProfilResponse = Either<GetPatientProfilErrors.PatientProfilNotFoundError | AppError.UnexpectedError, Result<PatientProfilDto>>;
