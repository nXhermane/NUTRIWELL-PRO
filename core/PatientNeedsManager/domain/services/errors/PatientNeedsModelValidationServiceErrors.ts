import { ExceptionBase, INTERNAL_SERVER_ERROR } from "@/core/shared";

export class PatientNeedsModelValidationServiceErrors extends ExceptionBase {
   readonly code = INTERNAL_SERVER_ERROR;
}
