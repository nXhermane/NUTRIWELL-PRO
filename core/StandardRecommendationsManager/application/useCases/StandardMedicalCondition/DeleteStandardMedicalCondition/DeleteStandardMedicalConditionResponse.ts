import { AppError, Either, Result } from "@/core/shared";

export type DeleteStandardMedicalConditionResponse = Either<AppError.UnexpectedError, Result<boolean>> 