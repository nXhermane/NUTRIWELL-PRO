import { GetPersonalAndSocialStoryErrors } from "./GetPersonalAndSocialStoryErrors";
import { GetPersonalAndSocialStoryRequest } from "./GetPersonalAndSocialStoryRequest";
import { GetPersonalAndSocialStoryResponse } from "./GetPersonalAndSocialStoryResponse";
import { MedicalRecord } from "./../../../../domain";
import { MedicalRecordDto, MedicalRecordPersistenceType, PersonalAndSocialStoryDto } from "./../../../../infrastructure";
import { MedicalRecordRepository, MedicalRecordRepositoryError } from "./../../../../infrastructure";
import { UseCase, AggregateID, Mapper, Result, AppError, left, right } from "@shared";

export class GetPersonalAndSocialStoryUseCase implements UseCase<GetPersonalAndSocialStoryRequest, GetPersonalAndSocialStoryResponse> {
   constructor(
      private medicalRecordRepo: MedicalRecordRepository,
      private medicalRecordMapper: Mapper<MedicalRecord, MedicalRecordPersistenceType, MedicalRecordDto>,
   ) {}

   async execute(request: GetPersonalAndSocialStoryRequest): Promise<GetPersonalAndSocialStoryResponse> {
      try {
         const medicalRecord = await this.getMedicalRecord(request.patientId);
         const personalAndSocialStory = this.getPersonalAndSocialStoryStoryToMedicalRecord(medicalRecord);
         return right(Result.ok<PersonalAndSocialStoryDto>(personalAndSocialStory));
      } catch (e: any) {
         if (e instanceof GetPersonalAndSocialStoryErrors.MedicalRecordNotFoundError)
            return left(new GetPersonalAndSocialStoryErrors.MedicalRecordNotFoundError(e.err.message));
         else return left(new AppError.UnexpectedError(e));
      }
   }

   private async getMedicalRecord(medicalRecordId: AggregateID): Promise<MedicalRecord> {
      try {
         return await this.medicalRecordRepo.getById(medicalRecordId);
      } catch (e) {
         throw new GetPersonalAndSocialStoryErrors.MedicalRecordNotFoundError(e, medicalRecordId);
      }
   }

   private getPersonalAndSocialStoryStoryToMedicalRecord(medicalRecord: MedicalRecord): PersonalAndSocialStoryDto {
      const reponseMedicalRecord = this.medicalRecordMapper.toResponse(medicalRecord);
      return reponseMedicalRecord.personalAndSocialStory as PersonalAndSocialStoryDto;
   }
}
