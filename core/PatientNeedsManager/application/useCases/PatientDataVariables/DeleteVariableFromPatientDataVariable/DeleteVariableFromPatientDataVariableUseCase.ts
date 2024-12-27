import { AppError, left, NotFoundException, Result, right, UseCase } from "@/core/shared";
import { DeleteVariableFromPatientDataVariableRequest } from "./DeleteVariableFromPatientDataVariableRequest";
import { DeleteVariableFromPatientDataVariableResponse } from "./DeleteVariableFromPatientDataVariableResponse";
import { PatientDataVariableRepository, PatientDataVariableRepositoryError } from "../../../../infrastructure";
import { err } from "react-native-svg";
import { DeleteVariableFromPatientDataVariableErrors } from "./DeleteVariableFromPatientDataVariableErrors";

export class DeleteVariableFromPatientDataVariable
   implements UseCase<DeleteVariableFromPatientDataVariableRequest, DeleteVariableFromPatientDataVariableResponse>
{
   constructor(private repo: PatientDataVariableRepository) {}
   async execute(request: DeleteVariableFromPatientDataVariableRequest): Promise<DeleteVariableFromPatientDataVariableResponse> {
      try {
         const patientDataVariable = await this.repo.getById(request.patientDataVariableId);
         patientDataVariable.getVariableByName(request.variableName);
         patientDataVariable.deleteVariable(request.variableName);
         await this.repo.save(patientDataVariable);
         return right(Result.ok<boolean>(true));
      } catch (error) {
         if (error instanceof NotFoundException) return left(new DeleteVariableFromPatientDataVariableErrors.VariableNotFound(error));
         else if (error instanceof PatientDataVariableRepositoryError)
            return left(new DeleteVariableFromPatientDataVariableErrors.PatientDataVariableNotFoundError(error, request.patientDataVariableId));
         return left(new AppError.UnexpectedError(error));
      }
   }
}
