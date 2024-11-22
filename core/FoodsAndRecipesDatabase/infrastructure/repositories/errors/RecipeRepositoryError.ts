import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";

export class RecipeRepositoryError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class RecipeRepositoryNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
