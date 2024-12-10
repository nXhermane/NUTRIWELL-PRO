import { ExceptionBase, INTERNAL_SERVER_ERROR } from "@/core/shared";

export class NutritionalStandardNeedsCalculatorError extends ExceptionBase {
   readonly code = INTERNAL_SERVER_ERROR;
}
