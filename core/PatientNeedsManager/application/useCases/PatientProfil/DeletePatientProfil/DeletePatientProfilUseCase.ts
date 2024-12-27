import { AppError, left, Result, right, UseCase } from "@/core/shared";
import { DeletePatientProfilRequest } from "./DeletePatientProfilRequest";
import { DeletePatientProfilResponse } from "./DeletePatientProfilResponse";
import { PatientProfilRepository, PatientProfilRepositoryError } from "./../../../../infrastructure";

export class DeletePatientProfilUseCase implements UseCase<DeletePatientProfilRequest, DeletePatientProfilResponse> {
   constructor(private repo: PatientProfilRepository) {}
   async execute(request: DeletePatientProfilRequest): Promise<DeletePatientProfilResponse> {
      try {
         await this.repo.delete(request.patientProfilIdOrPatientId);
         return right(Result.ok<boolean>(true));
      } catch (error) {
         if (error instanceof PatientProfilRepositoryError) return right(Result.ok<boolean>(false));
         return left(new AppError.UnexpectedError(error));
      }
   }
}
