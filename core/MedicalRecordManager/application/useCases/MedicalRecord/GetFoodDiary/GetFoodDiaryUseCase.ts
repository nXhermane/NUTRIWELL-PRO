import { GetFoodDiaryErrors } from "./GetFoodDiaryErrors";
import { GetFoodDiaryRequest } from "./GetFoodDiaryRequest";
import { GetFoodDiaryResponse } from "./GetFoodDiaryResponse";
import { MedicalRecord } from "./../../../../domain";
import { MedicalRecordDto, MedicalRecordPersistenceType, FoodDiaryDto } from "./../../../../infrastructure";
import { MedicalRecordRepository, MedicalRecordRepositoryError } from "./../../../../infrastructure";
import { UseCase, AggregateID, Mapper, Result, left, right, AppError } from "@shared";

export class GetFoodDiaryUseCase implements UseCase<GetFoodDiaryRequest, GetFoodDiaryResponse> {
   constructor(
      private medicalRecordRepo: MedicalRecordRepository,
      private medicalRecordMapper: Mapper<MedicalRecord, MedicalRecordPersistenceType, MedicalRecordDto>,
   ) {}

   async execute(request: GetFoodDiaryRequest): Promise<GetFoodDiaryResponse> {
      try {
         const medicalRecord = await this.getMedicalRecord(request.patientId);
         const foodDiary = this.getFoodDiaryToMedicalRecord(medicalRecord, request.foodDiaryId);
         return right(Result.ok<FoodDiaryDto>(foodDiary));
      } catch (e: any) {
         if (e instanceof GetFoodDiaryErrors.MedicalRecordNotFoundError)
            return left(new GetFoodDiaryErrors.MedicalRecordNotFoundError(e.err.message));
         else return left(new AppError.UnexpectedError(e));
      }
   }

   private async getMedicalRecord(medicalRecordId: AggregateID): Promise<MedicalRecord> {
      try {
         return await this.medicalRecordRepo.getById(medicalRecordId);
      } catch (e) {
         throw new GetFoodDiaryErrors.MedicalRecordNotFoundError(e, medicalRecordId);
      }
   }

   private getFoodDiaryToMedicalRecord(medicalRecord: MedicalRecord, foodDiaryId: AggregateID): FoodDiaryDto {
      const reponseMedicalRecord = this.medicalRecordMapper.toResponse(medicalRecord);
      return reponseMedicalRecord.foodDiaries.find((foodDairy: FoodDiaryDto) => foodDairy.id === foodDiaryId) as FoodDiaryDto;
   }
}
