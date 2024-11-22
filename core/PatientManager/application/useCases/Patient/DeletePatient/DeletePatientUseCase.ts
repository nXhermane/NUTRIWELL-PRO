import { DeletePatientErrors } from "./DeletePatientErrors";
import { DeletePatientRequest } from "./DeletePatientRequest";
import { DeletePatientResponse } from "./DeletePatientResponse";
import { UseCase, FileManager, Image, Result, left, right, AppError } from "@shared";
import { PatientRepository, PatientRepositoryError } from "./../../../../infrastructure";

export class DeletePatientUseCase implements UseCase<DeletePatientRequest, DeletePatientResponse> {
   constructor(
      private patientRepo: PatientRepository,
      private fileManager: FileManager,
   ) {}

   async execute(request: DeletePatientRequest): Promise<DeletePatientResponse> {
      try {
         const patient = await this.patientRepo.getById(request.patientId);
         await Promise.all(patient.getImage().map(async (img: Image) => this.fileManager.delete(img.uri)));
         await this.patientRepo.delete(patient.id);
         return right(Result.ok<boolean>(true));
      } catch (e) {
         if (e instanceof PatientRepositoryError) return left(new DeletePatientErrors.PatientNotFoundError(e, request.patientId));
         return left(new AppError.UnexpectedError(e));
      }
   }
}
