import { CreateFoodDiaryErrors } from "./CreateFoodDiaryErrors";
import { CreateFoodDiaryRequest } from "./CreateFoodDiaryRequest";
import { CreateFoodDiaryResponse } from "./CreateFoodDiaryResponse";
import { MedicalRecord, FoodDiary } from "./../../../../domain";
import { MedicalRecordRepository, MedicalRecordRepositoryError } from "./../../../../infrastructure";
import { Image, FileManager, UseCase, AggregateID, Result, left, right, AppError } from "@shared";

export class CreateFoodDiaryUseCase implements UseCase<CreateFoodDiaryRequest, CreateFoodDiaryResponse> {
   constructor(
      private medicalRecordRepo: MedicalRecordRepository,
      private fileManager: FileManager,
   ) {}

   async execute(request: CreateFoodDiaryRequest): Promise<CreateFoodDiaryResponse> {
      try {
         const foodDiary = await this.createFoodDiary(request);
         const medicalRecord = await this.getMedicalRecord(request.patientId);
         await this.saveFoodDiaryImages(foodDiary, medicalRecord.id);
         this.addFoodDiaryToMedicalRecord(medicalRecord, foodDiary);
         await this.saveMedicalRecord(medicalRecord);
         return right(Result.ok<AggregateID>(foodDiary.id));
      } catch (e: any) {
         if (e instanceof CreateFoodDiaryErrors.FoodDiaryFactoryError) {
            return left(new CreateFoodDiaryErrors.FoodDiaryFactoryError(e.err.message));
         } else if (e instanceof CreateFoodDiaryErrors.MedicalRecordNotFoundError) {
            return left(new CreateFoodDiaryErrors.MedicalRecordNotFoundError(e.err.message));
         } else if (e instanceof CreateFoodDiaryErrors.MedicalRecordRepoError) {
            return left(new CreateFoodDiaryErrors.MedicalRecordRepoError(e.err.message));
         } else {
            return left(new AppError.UnexpectedError(e));
         }
      }
   }

   private async createFoodDiary(request: CreateFoodDiaryRequest): Promise<FoodDiary> {
      const foodDiary = await FoodDiary.create(request.data);
      if (foodDiary.isFailure) throw new CreateFoodDiaryErrors.FoodDiaryFactoryError(foodDiary.err);
      return foodDiary.val;
   }

   private async getMedicalRecord(medicalRecordId: AggregateID): Promise<MedicalRecord> {
      try {
         return await this.medicalRecordRepo.getById(medicalRecordId);
      } catch (e) {
         throw new CreateFoodDiaryErrors.MedicalRecordNotFoundError(e);
      }
   }

   private async saveFoodDiaryImages(foodDiary: FoodDiary, medicalRecordId: AggregateID) {
      const imagesDir = `${medicalRecordId}/foodDiaries`;
      const images = await Promise.all(
         foodDiary.getImage().map(
            async (img: Image) =>
               await this.fileManager.save({
                  file: img,
                  dirname: imagesDir,
               }),
         ),
      );
      foodDiary.images = images;
   }

   private addFoodDiaryToMedicalRecord(medicalRecord: MedicalRecord, foodDiary: FoodDiary) {
      medicalRecord.addFoodDiary(foodDiary);
   }

   private async saveMedicalRecord(medicalRecord: any) {
      try {
         await this.medicalRecordRepo.save(medicalRecord);
      } catch (e) {
         throw new CreateFoodDiaryErrors.MedicalRecordRepoError(e);
      }
   }
}
