import { AppError, Either, Result } from "@/core/shared";
import { RemoveMeasurementErrors } from "./RemoveMeasurementErrors";

export type RemoveMeasurementResponse = Either<
   | AppError.UnexpectedError
   | RemoveMeasurementErrors.MeasurementFactoryError
   | RemoveMeasurementErrors.MedicalRecordRepoError
   | RemoveMeasurementErrors.MedicalRecordNotFoundError,
   Result<void>
>;
