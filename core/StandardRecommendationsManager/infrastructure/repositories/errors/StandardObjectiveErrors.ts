import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class StandardObjectiveError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class StandardObjectiveNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
