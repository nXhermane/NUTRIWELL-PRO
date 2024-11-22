import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class NutritionistRepositoryError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class NutritionistRepositoryNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
