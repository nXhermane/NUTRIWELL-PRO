import { AppError, Either, Result } from "@/core/shared";
import { UpdateStandardMedicalConditionErrors } from "./UpdateStandardMedicalConditionErrors";

export type UpdateStandardMedicalConditionResponse = Either<
   | UpdateStandardMedicalConditionErrors.StandardMedicalConditionRepoError
   | UpdateStandardMedicalConditionErrors.StandardMedicalConditionValidationError
   | UpdateStandardMedicalConditionErrors.StandardMedicalConditionnNotFoundError
   | AppError.UnexpectedError,
   Result<void>
>;
