import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class PatientProfilRepositoryError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class PatientProfilRepositoryNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
