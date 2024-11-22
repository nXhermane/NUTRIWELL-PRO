import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class FoodStoryRepositoryError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class FoodStoryRepositoryNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
