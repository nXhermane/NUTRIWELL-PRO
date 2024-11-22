import { AggregateID, Either, Result, AppError } from "@shared";
import { AddMeasurementErrors } from "./AddMeasurementErrors";
export type AddMeasurementResponse = Either<
   | AppError.UnexpectedError
   | AddMeasurementErrors.MedicalRecordNotFoundError
   | AddMeasurementErrors.MedicalRecordRepoError
   | AddMeasurementErrors.MeasurementFactoryError,
   Result<void>
>;
