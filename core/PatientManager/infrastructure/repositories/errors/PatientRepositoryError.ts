import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class PatientRepositoryError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class PatientRepositoryNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
