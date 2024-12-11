import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class PatientNeedsModelRepositoryError extends ExceptionBase {
    code = INTERNAL_SERVER_ERROR;
}
export class PatientNeedsModelRepositoryNotFoundException extends ExceptionBase {
    code = NOT_FOUND;
}
