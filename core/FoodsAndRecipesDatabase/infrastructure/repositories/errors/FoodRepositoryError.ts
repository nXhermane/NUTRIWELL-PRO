import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class FoodRepositoryError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class FoodRepositoryNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
