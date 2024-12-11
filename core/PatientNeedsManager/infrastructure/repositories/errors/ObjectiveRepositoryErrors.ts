import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class ObjectiveRepositoryError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class ObjectiveRepositoryNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
