import { Either, Result } from "./../../../../../../core";
import { AppError } from "./../../../../../../application";
import { GetAllMeasurementTypeIdErrors } from "./GetAllMeasurementTypeIdErrors";
import { AggregateID } from "./../../../../../../domain";
export type GetAllMeasurementTypeIdResponse = Either<
   AppError.UnexpectedError | GetAllMeasurementTypeIdErrors.MeasurementTypeRepositoryError,
   Result<{ id: AggregateID; code: string }[]>
>;
