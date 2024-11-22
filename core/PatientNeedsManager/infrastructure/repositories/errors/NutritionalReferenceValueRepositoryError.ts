import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class NutritionalReferenceValueRepositoryError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class NutritionalReferenceValueRepositoryNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
