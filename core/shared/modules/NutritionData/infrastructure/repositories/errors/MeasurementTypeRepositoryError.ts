import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "./../../../../../exceptions";
export class MeasurementTypeRepositoryError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class MeasurementTypeRepositoryNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
