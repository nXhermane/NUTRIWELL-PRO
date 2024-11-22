import { AggregateID, AppError, Either, Result } from "@shared";
import { CreateObjectiveErrors } from "./CreateObjectiveErrors";
export type CreateObjectiveResponse = Either<
   | AppError.UnexpectedError
   | CreateObjectiveErrors.MedicalRecordNotFoundError
   | CreateObjectiveErrors.MedicalRecordRepoError
   | CreateObjectiveErrors.ObjectiveFactoryError,
   Result<AggregateID>
>;
