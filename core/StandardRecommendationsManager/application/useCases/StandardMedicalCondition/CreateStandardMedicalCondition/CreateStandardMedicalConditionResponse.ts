import { AggregateID, AppError, Either, Result } from "@/core/shared";
import { CreateStandardMedicalConditionErrors } from "./CreateStandardMedicalConditionErrors";

export type CreateStandardMedicalConditionResponse = Either<
   | AppError.UnexpectedError
   | CreateStandardMedicalConditionErrors.CreateStandardMedicalConditionError
   | CreateStandardMedicalConditionErrors.CreateStandardMedicalConditionFailed,
   Result<{ id: AggregateID }>
>;
