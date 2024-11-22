import { AggregateID, AppError, Either, Result } from "@/core/shared";
import { CreateStandardObjectiveErrors } from "./CreateStandardObjectiveErrors";

export type CreateStandardObjectiveResponse = Either<
    AppError.UnexpectedError | CreateStandardObjectiveErrors.CreateStandardObjectiveError | CreateStandardObjectiveErrors.CreateStandardObjectiveFailed, Result<{ id: AggregateID }>
>;
