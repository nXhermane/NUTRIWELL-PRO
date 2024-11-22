import { GetMedicalStoryErrors } from "./GetMedicalStoryErrors";
import { GetMedicalStoryRequest } from "./GetMedicalStoryRequest";
import { GetMedicalStoryResponse } from "./GetMedicalStoryResponse";
import { MedicalRecord } from "./../../../../domain";
import { MedicalRecordDto, MedicalRecordPersistenceType, MedicalStoryDto } from "./../../../../infrastructure";
import { MedicalRecordRepository, MedicalRecordRepositoryError } from "./../../../../infrastructure";
import { UseCase, AggregateID, Mapper, Result, AppError, left, right } from "@shared";

export class GetMedicalStoryUseCase implements UseCase<GetMedicalStoryRequest, GetMedicalStoryResponse> {
   constructor(
      private medicalRecordRepo: MedicalRecordRepository,
      private medicalRecordMapper: Mapper<MedicalRecord, MedicalRecordPersistenceType, MedicalRecordDto>,
   ) {}

   async execute(request: GetMedicalStoryRequest): Promise<GetMedicalStoryResponse> {
      try {
         const medicalRecord = await this.getMedicalRecord(request.patientId);
         const medicalStory = this.getMedicalStoryStoryToMedicalRecord(medicalRecord);
         return right(Result.ok<MedicalStoryDto>(medicalStory));
      } catch (e: any) {
         if (e instanceof GetMedicalStoryErrors.MedicalRecordNotFoundError)
            return left(new GetMedicalStoryErrors.MedicalRecordNotFoundError(e.err.message));
         return left(new AppError.UnexpectedError(e));
      }
   }

   private async getMedicalRecord(medicalRecordId: AggregateID): Promise<MedicalRecord> {
      try {
         return await this.medicalRecordRepo.getById(medicalRecordId);
      } catch (e) {
         throw new GetMedicalStoryErrors.MedicalRecordNotFoundError(e);
      }
   }

   private getMedicalStoryStoryToMedicalRecord(medicalRecord: MedicalRecord): MedicalStoryDto {
      const reponseMedicalRecord = this.medicalRecordMapper.toResponse(medicalRecord);
      return reponseMedicalRecord.medicalStory as MedicalStoryDto;
   }
}
