import { AggregateID } from "./../../../../../../domain";
import { Either, Result } from "./../../../../../../core";
import { AppError } from "./../../../../../../application";
import { CreateMeasurementTypeErrors } from "./CreateMeasurementTypeErrors";

export type CreateMeasurementTypeResponse = Either<
   AppError.UnexpectedError | CreateMeasurementTypeErrors.CreateMeasurementTypeFailed | CreateMeasurementTypeErrors.CreateMeasurementTypeError,
   Result<{ id: AggregateID; code: string }>
>;
