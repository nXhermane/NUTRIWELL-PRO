import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class PersonalAndSocialStoryRepositoryError extends ExceptionBase {
   code = INTERNAL_SERVER_ERROR;
}
export class PersonalAndSocialStoryRepositoryNotFoundException extends ExceptionBase {
   code = NOT_FOUND;
}
