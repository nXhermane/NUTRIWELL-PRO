import { AggregateID } from "./../../../../../../domain";
import { Either, Result } from "./../../../../../../core";
import { AppError } from "./../../../../../../application";

export type DeleteMeasurementTypeResponse = Either<AppError.UnexpectedError, Result<boolean>>;
