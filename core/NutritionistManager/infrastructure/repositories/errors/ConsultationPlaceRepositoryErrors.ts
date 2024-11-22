import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class ConsultationPlaceError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class ConsultationPlaceNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
