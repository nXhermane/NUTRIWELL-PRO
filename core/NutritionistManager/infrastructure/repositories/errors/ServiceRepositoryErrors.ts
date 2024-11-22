import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class ServiceError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class ServiceNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
