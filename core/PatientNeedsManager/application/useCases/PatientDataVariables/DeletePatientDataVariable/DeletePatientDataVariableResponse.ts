import { AppError, Either, Result } from "@/core/shared";

export type DeletePatientDataVariableResponse = Either<AppError.UnexpectedError, Result<boolean>>;
