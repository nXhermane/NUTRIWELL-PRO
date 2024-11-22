import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class RefreshTokenRepositoryError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class RefreshTokenRepositoryNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
