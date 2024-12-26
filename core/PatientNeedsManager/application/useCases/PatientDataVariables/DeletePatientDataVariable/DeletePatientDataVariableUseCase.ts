import { AppError, left, Result, right, UseCase } from "@/core/shared";
import { DeletePatientDataVariableRequest } from "./DeletePatientDataVariableRequest";
import { DeletePatientDataVariableResponse } from "./DeletePatientDataVariableResponse";
import { PatientDataVariableRepository, PatientDataVariableRepositoryError } from "@/core/PatientNeedsManager/infrastructure";

export class DeletePatientDataVariableUseCase implements UseCase<DeletePatientDataVariableRequest, DeletePatientDataVariableResponse> {
   constructor(private repo: PatientDataVariableRepository) {}
   async execute(request: DeletePatientDataVariableRequest): Promise<DeletePatientDataVariableResponse> {
      try {
         await this.repo.delete(request.patientDataVariableId);
         return right(Result.ok<boolean>(true));
      } catch (error) {
         if (error instanceof PatientDataVariableRepositoryError) return right(Result.ok<boolean>(false));
         return left(new AppError.UnexpectedError(error));
      }
   }
}
