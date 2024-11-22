import { CreateMedicalRecordErrors } from "./CreateMedicalRecordErrors";
import { CreateMedicalRecordRequest } from "./CreateMedicalRecordRequest";
import { CreateMedicalRecordResponse } from "./CreateMedicalRecordResponse";
import { MedicalRecord } from "./../../../../domain";
import { MedicalRecordRepository, MedicalRecordRepositoryError } from "./../../../../infrastructure";
import { UseCase, AggregateID, Result, right, left, AppError } from "@shared";

export class CreateMedicalRecordUseCase implements UseCase<CreateMedicalRecordRequest, CreateMedicalRecordResponse> {
   constructor(private medicalRecordRepo: MedicalRecordRepository) {}
   async execute(request: CreateMedicalRecordRequest): Promise<CreateMedicalRecordResponse> {
      try {
         const medicalRecord = await MedicalRecord.create(request.patientId, request.data);
         if (medicalRecord.isFailure) return left(new CreateMedicalRecordErrors.CreateMedicalRecordFailed(medicalRecord.err));
         return right(Result.ok<void>());
      } catch (e: any) {
         if (e instanceof MedicalRecordRepositoryError) return left(new CreateMedicalRecordErrors.MedicalRecordRepoError(e));
         else return left(new AppError.UnexpectedError(e));
      }
   }
}
