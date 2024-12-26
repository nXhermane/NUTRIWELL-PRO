import { AppError, left, Result, right, UseCase } from "@/core/shared";
import { AddVariableToPatientDataVariableRequest } from "./AddVariableToPatientDataVariableRequest";
import { AddVariableToPatientDataVariableResponse } from "./AddVariableToPatientDataVariableResponse";
import { PatientDataVariableRepository, PatientDataVariableRepositoryError } from "../../../../infrastructure";
import { AddVariableToPatientDataVariableErrors } from "./AddVariableToPatientDataVariableErrors";

export class AddVariableToPatientDataVariableUseCase
   implements UseCase<AddVariableToPatientDataVariableRequest, AddVariableToPatientDataVariableResponse>
{
   constructor(private repo: PatientDataVariableRepository) {}
   async execute(request: AddVariableToPatientDataVariableRequest): Promise<AddVariableToPatientDataVariableResponse> {
      try {
         const patientDataVariable = await this.repo.getById(request.patientDataVariableId);
         patientDataVariable.addVariable(request.variables);
         await this.repo.save(patientDataVariable);
         return right(Result.ok<void>());
      } catch (error) {
         if (error instanceof PatientDataVariableRepositoryError)
            return left(new AddVariableToPatientDataVariableErrors.PatientDataVariableNotFoundError(error));
         return left(new AppError.UnexpectedError(error));
      }
   }
}
