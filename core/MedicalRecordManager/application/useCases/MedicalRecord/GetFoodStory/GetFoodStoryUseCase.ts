import { GetFoodStoryErrors } from "./GetFoodStoryErrors";
import { GetFoodStoryRequest } from "./GetFoodStoryRequest";
import { GetFoodStoryResponse } from "./GetFoodStoryResponse";
import { MedicalRecord } from "./../../../../domain";
import { MedicalRecordDto, MedicalRecordPersistenceType, FoodStoryDto } from "./../../../../infrastructure";
import { MedicalRecordRepository, MedicalRecordRepositoryError } from "./../../../../infrastructure";
import { UseCase, AggregateID, Mapper, Result, left, right, AppError } from "@shared";

export class GetFoodStoryUseCase implements UseCase<GetFoodStoryRequest, GetFoodStoryResponse> {
   constructor(
      private medicalRecordRepo: MedicalRecordRepository,
      private medicalRecordMapper: Mapper<MedicalRecord, MedicalRecordPersistenceType, MedicalRecordDto>,
   ) {}

   async execute(request: GetFoodStoryRequest): Promise<GetFoodStoryResponse> {
      try {
         const medicalRecord = await this.getMedicalRecord(request.patientId);
         const foodStory = this.getFoodStoryToMedicalRecord(medicalRecord);
         return right(Result.ok<FoodStoryDto>(foodStory));
      } catch (e: any) {
         if (e instanceof GetFoodStoryErrors.MedicalRecordNotFoundError)
            return left(new GetFoodStoryErrors.MedicalRecordNotFoundError(e.err.message));
         else return left(new AppError.UnexpectedError(e));
      }
   }

   private async getMedicalRecord(medicalRecordId: AggregateID): Promise<MedicalRecord> {
      try {
         return await this.medicalRecordRepo.getById(medicalRecordId);
      } catch (e) {
         throw new GetFoodStoryErrors.MedicalRecordNotFoundError(e, medicalRecordId);
      }
   }

   private getFoodStoryToMedicalRecord(medicalRecord: MedicalRecord): FoodStoryDto {
      const reponseMedicalRecord = this.medicalRecordMapper.toResponse(medicalRecord);
      return reponseMedicalRecord.foodStory as FoodStoryDto;
   }
}
