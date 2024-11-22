import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class MedicalStoryRepositoryError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class MedicalStoryRepositoryNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
