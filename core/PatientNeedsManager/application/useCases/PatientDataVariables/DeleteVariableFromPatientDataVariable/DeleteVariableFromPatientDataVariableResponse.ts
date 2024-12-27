import { Either, Result } from "@/core/shared";
import { DeleteVariableFromPatientDataVariableErrors } from "./DeleteVariableFromPatientDataVariableErrors";

export type DeleteVariableFromPatientDataVariableResponse = Either<
   DeleteVariableFromPatientDataVariableErrors.VariableNotFound | DeleteVariableFromPatientDataVariableErrors.PatientDataVariableNotFoundError,
   Result<boolean>
>;
