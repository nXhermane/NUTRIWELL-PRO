import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class FoodDiaryError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class FoodDiaryNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
