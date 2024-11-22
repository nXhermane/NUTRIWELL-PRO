import { Result, AppError, Either } from "@shared";
import { CreateMedicalRecordErrors } from "./CreateMedicalRecordErrors";
export type CreateMedicalRecordResponse = Either<
   AppError.UnexpectedError | CreateMedicalRecordErrors.MedicalRecordRepoError | CreateMedicalRecordErrors.CreateMedicalRecordFailed,
   Result<void>
>;
