import { AppError, Either, Result } from "@/core/shared";

export type DeleteStandardObjectiveResponse = Either<AppError.UnexpectedError, Result<boolean>>