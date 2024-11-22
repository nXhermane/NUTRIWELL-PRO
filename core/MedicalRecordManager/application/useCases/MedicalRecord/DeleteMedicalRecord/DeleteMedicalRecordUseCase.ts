import { DeleteMedicalRecordRequest } from "./DeleteMedicalRecordRequest";
import { DeleteMedicalRecordResponse } from "./DeleteMedicalRecordResponse";
import { UseCase, AppError, Result, left, right } from "@shared";
import { MedicalRecordRepository, MedicalRecordRepositoryError } from "./../../../../infrastructure";

export class DeleteMedicalRecordUseCase implements UseCase<DeleteMedicalRecordRequest, DeleteMedicalRecordResponse> {
   constructor(private repo: MedicalRecordRepository) {}

   async execute(request: DeleteMedicalRecordRequest): Promise<DeleteMedicalRecordResponse> {
      try {
         const medicalRecord = await this.repo.getById(request.patientId);
         medicalRecord.delete();
         await this.repo.delete(medicalRecord.id);
         return right(Result.ok<boolean>(true));
      } catch (e: any) {
         if (e instanceof MedicalRecordRepositoryError) return right(Result.ok<boolean>(false));
         else return left(new AppError.UnexpectedError(e));
      }
   }
}
