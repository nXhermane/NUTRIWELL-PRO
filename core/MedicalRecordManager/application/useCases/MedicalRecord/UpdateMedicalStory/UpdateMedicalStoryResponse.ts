import { Result, Either, AppError } from "@shared";
import { UpdateMedicalStoryErrors } from "./UpdateMedicalStoryErrors";
export type UpdateMedicalStoryResponse = Either<
   AppError.UnexpectedError | UpdateMedicalStoryErrors.MedicalRecordNotFoundError | UpdateMedicalStoryErrors.MedicalRecordRepoError,
   Result<void>
>;
