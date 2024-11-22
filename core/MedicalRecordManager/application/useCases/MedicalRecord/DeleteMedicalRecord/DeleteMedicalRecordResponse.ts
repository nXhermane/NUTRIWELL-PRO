import { Result, Either, AppError } from "@shared";
export type DeleteMedicalRecordResponse = Either<AppError.UnexpectedError, Result<boolean>>;
