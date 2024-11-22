import { GetAllFoodDiaryErrors } from "./GetAllFoodDiaryErrors";
import { GetAllFoodDiaryRequest } from "./GetAllFoodDiaryRequest";
import { GetAllFoodDiaryResponse } from "./GetAllFoodDiaryResponse";
import { MedicalRecord } from "./../../../../domain";
import { MedicalRecordDto, MedicalRecordPersistenceType, FoodDiaryDto } from "./../../../../infrastructure";
import { MedicalRecordRepository, MedicalRecordRepositoryError } from "./../../../../infrastructure";
import { UseCase, AggregateID, Mapper, Result, left, right, AppError } from "@shared";

export class GetAllFoodDiaryUseCase implements UseCase<GetAllFoodDiaryRequest, GetAllFoodDiaryResponse> {
   constructor(
      private medicalRecordRepo: MedicalRecordRepository,
      private medicalRecordMapper: Mapper<MedicalRecord, MedicalRecordPersistenceType, MedicalRecordDto>,
   ) {}

   async execute(request: GetAllFoodDiaryRequest): Promise<GetAllFoodDiaryResponse> {
      try {
         const medicalRecord = await this.getMedicalRecord(request.patientId);
         const foodDiaries = this.getAllFoodDiaryToMedicalRecord(medicalRecord);
         return right(Result.ok<FoodDiaryDto[]>(foodDiaries));
      } catch (e: any) {
         if (e instanceof GetAllFoodDiaryErrors.MedicalRecordNotFoundError) {
            return left(new GetAllFoodDiaryErrors.MedicalRecordNotFoundError(e.err.message));
         } else {
            return left(new AppError.UnexpectedError(e));
         }
      }
   }

   private async getMedicalRecord(medicalRecordId: AggregateID): Promise<MedicalRecord> {
      try {
         return await this.medicalRecordRepo.getById(medicalRecordId);
      } catch (e: any) {
         throw new GetAllFoodDiaryErrors.MedicalRecordNotFoundError(e);
      }
   }

   private getAllFoodDiaryToMedicalRecord(medicalRecord: MedicalRecord): FoodDiaryDto[] {
      const reponseMedicalRecord = this.medicalRecordMapper.toResponse(medicalRecord);
      return reponseMedicalRecord.foodDiaries;
   }
}
