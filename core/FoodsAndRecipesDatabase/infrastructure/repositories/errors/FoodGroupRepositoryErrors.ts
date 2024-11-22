import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class FoodGroupRepositoryError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class FoodgroupRepositoryNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
