import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class NutritionFormularRepositoryError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class NutritionFormularRepositoryNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
