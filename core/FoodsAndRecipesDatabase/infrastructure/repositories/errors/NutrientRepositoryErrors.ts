import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class NutrientRepositoryError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class NutrientRepositoryNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
