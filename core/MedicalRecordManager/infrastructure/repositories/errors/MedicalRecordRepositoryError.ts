import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class MedicalRecordRepositoryError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class MedicalRecordRepositoryNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
