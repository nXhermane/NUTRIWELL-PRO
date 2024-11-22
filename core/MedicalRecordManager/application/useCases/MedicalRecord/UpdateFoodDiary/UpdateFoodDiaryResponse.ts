import { Either, Result, AppError } from "@shared";
import { UpdateFoodDiaryErrors } from "./UpdateFoodDiaryErrors";
export type UpdateFoodDiaryResponse = Either<
   AppError.UnexpectedError | UpdateFoodDiaryErrors.MedicalRecordNotFoundError | UpdateFoodDiaryErrors.MedicalRecordRepoError,
   Result<void>
>;
