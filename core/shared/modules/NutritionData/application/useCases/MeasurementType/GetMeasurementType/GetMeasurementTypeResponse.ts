import { AggregateID } from "./../../../../../../domain";
import { Either, Result } from "./../../../../../../core";
import { AppError } from "./../../../../../../application";
import { GetMeasurementTypeErrors } from "./GetMeasurementTypeErrors";
import { MeasurementTypeDto } from "./../../../../infrastructure";
export type GetMeasurementTypeResponse = Either<
   AppError.UnexpectedError | GetMeasurementTypeErrors.MeasurementTypeNotFoundError,
   Result<MeasurementTypeDto>
>;
