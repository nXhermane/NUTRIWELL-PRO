import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class StandardMedicalConditionError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class StandardMedicalConditionNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
