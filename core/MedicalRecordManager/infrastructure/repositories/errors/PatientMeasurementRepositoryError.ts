import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class PatientMeasurementRepositoryError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class PatientMeasurementRepositoryNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
