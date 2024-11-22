import { Either, Result } from "./../../../../../../core";
import { AppError } from "./../../../../../../application";
import { GetAllMeasurementTypeErrors } from "./GetAllMeasurementTypeErrors";
import { MeasurementTypeDto } from "./../../../../infrastructure";
export type GetAllMeasurementTypeResponse = Either<
   AppError.UnexpectedError | GetAllMeasurementTypeErrors.MeasurementTypeRepositoryError,
   Result<MeasurementTypeDto[]>
>;
