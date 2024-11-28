import { ExceptionBase, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@shared";
export class PatientDataVariableRepositoryError extends ExceptionBase {
    code = INTERNAL_SERVER_ERROR;
}
export class PatientDataVariableRepositoryNotFoundException extends ExceptionBase {
    code = NOT_FOUND;
}
