import { Result, Either, AppError } from "@shared";
import { UpdateFoodStoryErrors } from "./UpdateFoodStoryErrors";
export type UpdateFoodStoryResponse = Either<
   AppError.UnexpectedError | UpdateFoodStoryErrors.MedicalRecordNotFoundError | UpdateFoodStoryErrors.MedicalRecordRepoError,
   Result<void>
>;
