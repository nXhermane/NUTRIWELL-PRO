import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class ConsultationInformationError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class ConsultationInformationNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
