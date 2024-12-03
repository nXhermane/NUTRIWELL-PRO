import { ExceptionBase, INTERNAL_SERVER_ERROR } from "@/core/shared";

export class DataComposerServiceError extends ExceptionBase {
    readonly code = INTERNAL_SERVER_ERROR
}