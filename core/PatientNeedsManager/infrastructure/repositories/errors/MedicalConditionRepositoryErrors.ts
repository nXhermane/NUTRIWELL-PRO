import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class MedicalConditionRepositoryError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class MedicalConditionRepositoryNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
