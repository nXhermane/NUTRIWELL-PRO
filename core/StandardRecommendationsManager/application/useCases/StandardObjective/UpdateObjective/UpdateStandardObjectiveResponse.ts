import { AppError, Either, Result } from "@/core/shared";
import { UpdateStandardObjectiveErrors } from "./UpdateStandardObjectiveErrors";
export type UpdateStandardObjectiveResponse = Either<
   | AppError.UnexpectedError
   | UpdateStandardObjectiveErrors.StandardObjectiveNotFoundError
   | UpdateStandardObjectiveErrors.StandardObjectiveRepoError
   | UpdateStandardObjectiveErrors.StandardObjectiveValidationError,
   Result<void>
>;
