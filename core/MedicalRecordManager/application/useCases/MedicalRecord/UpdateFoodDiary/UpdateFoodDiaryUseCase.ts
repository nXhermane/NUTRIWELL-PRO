import { UpdateFoodDiaryErrors } from "./UpdateFoodDiaryErrors";
import { UpdateFoodDiaryRequest } from "./UpdateFoodDiaryRequest";
import { UpdateFoodDiaryResponse } from "./UpdateFoodDiaryResponse";
import {
   MedicalRecord,
   FoodDiary,
   type CreateFoodDiaryProps,
   type FoodItemProps,
   FoodDiaryMealEntry,
   FoodDiaryFoodItem,
   IFoodDiaryFoodItem,
} from "./../../../../domain";
import { MedicalRecordRepository, MedicalRecordRepositoryError, MedicalRecordDto, MedicalRecordPersistenceType } from "./../../../../infrastructure";
import {
   UseCase,
   AggregateID,
   FileManager,
   Quantity,
   Image,
   BaseEntityProps,
   DateManager,
   RegistrationDate,
   Result,
   AppError,
   left,
   right,
} from "@shared";

export class UpdateFoodDiaryUseCase implements UseCase<UpdateFoodDiaryRequest, UpdateFoodDiaryResponse> {
   constructor(
      private medicalRecordRepo: MedicalRecordRepository,
      private fileManager: FileManager,
   ) {}

   async execute(request: UpdateFoodDiaryRequest): Promise<UpdateFoodDiaryResponse> {
      try {
         const medicalRecord = await this.getMedicalRecord(request.patientId);
         const foodDiary = this.getFoodDiaryFromMedicalRecord(medicalRecord, request.data.id);
         this.updateFoodDiary(foodDiary, request.data);
         this.saveFoodDiaryImages(foodDiary, medicalRecord.id);
         this.updateMedicalRecord(medicalRecord, foodDiary);
         await this.saveMedicalRecord(medicalRecord);
         return right(Result.ok<void>());
      } catch (e: any) {
         if (e instanceof UpdateFoodDiaryErrors.MedicalRecordNotFoundError)
            return left(new UpdateFoodDiaryErrors.MedicalRecordNotFoundError(e.err.message));
         else if (e instanceof UpdateFoodDiaryErrors.MedicalRecordRepoError)
            return left(new UpdateFoodDiaryErrors.MedicalRecordRepoError(e.err.message));
         else return left(new AppError.UnexpectedError(e));
      }
   }

   private async getMedicalRecord(medicalRecordId: AggregateID): Promise<MedicalRecord> {
      try {
         return await this.medicalRecordRepo.getById(medicalRecordId);
      } catch (e) {
         throw new UpdateFoodDiaryErrors.MedicalRecordNotFoundError(e, medicalRecordId);
      }
   }

   private updateFoodDiary(foodDiary: FoodDiary, data: Partial<CreateFoodDiaryProps> & BaseEntityProps) {
      if (data?.date) foodDiary.date = new RegistrationDate(DateManager.formatDate(data.date));
      if (data?.observation) foodDiary.observation = data.observation;
      if (data?.images) foodDiary.images = data.images.map((uri: string) => new Image(uri));
      if (data?.meal) {
         const newMeal = new FoodDiaryMealEntry({
            withCompany: data?.meal?.withCompany || foodDiary.meal.withCompany,
            watchingTv: data?.meal?.watchingTv || foodDiary.meal.watchingTv,
            sittingAtTable: data?.meal?.sittingAtTable || foodDiary.meal.sittingAtTable,
            foodItems:
               data?.meal?.foodItems.map((foodItem: FoodItemProps) => {
                  const { quantity, ...otherProps } = foodItem;
                  return new FoodDiaryFoodItem({
                     quantity: new Quantity(quantity),
                     ...otherProps,
                  });
               }) || foodDiary.meal.foodItems,
            mealTypeId: data?.meal?.mealTypeId || foodDiary.meal.mealTypeId,
            description: data?.meal?.description || foodDiary.meal.description,
         });
         foodDiary.meal = newMeal;
      }
   }

   private getFoodDiaryFromMedicalRecord(medicalRecord: MedicalRecord, id: AggregateID): FoodDiary {
      const medicalRecordProps = medicalRecord.getProps();
      return medicalRecordProps.foodDiaries.find((foodDiary: FoodDiary) => foodDiary.id === id) as FoodDiary;
   }

   private updateMedicalRecord(medicalRecord: MedicalRecord, foodDiary: FoodDiary) {
      medicalRecord.updateFoodDiary(foodDiary);
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
   private async saveMedicalRecord(medicalRecord: MedicalRecord) {
      try {
         await this.medicalRecordRepo.save(medicalRecord);
      } catch (e) {
         throw new UpdateFoodDiaryErrors.MedicalRecordRepoError(e);
      }
   }
}
