import { AppError, Either, Result } from "@/core/shared";

export type DeletePatientProfilResponse = Either<AppError.UnexpectedError, Result<boolean>>;
