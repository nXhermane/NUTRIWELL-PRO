import { UpdateFoodStoryErrors } from "./UpdateFoodStoryErrors";
import { UpdateFoodStoryRequest } from "./UpdateFoodStoryRequest";
import { UpdateFoodStoryResponse } from "./UpdateFoodStoryResponse";
import {
   MedicalRecord,
   FoodStory,
   type CreateFoodStoryProps,
   FavoriteFood,
   IFavoriteFood,
   Aversion,
   IAversion,
   WaterConsumptionRange,
} from "./../../../../domain";
import {
   MedicalRecordRepository,
   MedicalRecordRepositoryError,
   FoodStoryDto,
   MedicalRecordDto,
   MedicalRecordPersistenceType,
} from "./../../../../infrastructure";
import { UseCase, AggregateID, Time, Result, AppError, left, right } from "@shared";

export class UpdateFoodStoryUseCase implements UseCase<UpdateFoodStoryRequest, UpdateFoodStoryResponse> {
   constructor(private medicalRecordRepo: MedicalRecordRepository) {}

   async execute(request: UpdateFoodStoryRequest): Promise<UpdateFoodStoryResponse> {
      try {
         const medicalRecord = await this.getMedicalRecord(request.patientId);
         const foodStory = this.getFoodStoryFromMedicalRecord(medicalRecord);
         this.updateFoodStory(foodStory, request.data);
         this.updateMedicalRecord(medicalRecord, foodStory);
         await this.saveMedicalRecord(medicalRecord);
         return right(Result.ok<void>());
      } catch (e: any) {
         if (e instanceof UpdateFoodStoryErrors.MedicalRecordNotFoundError)
            return left(new UpdateFoodStoryErrors.MedicalRecordNotFoundError(e.err.message));
         else if (e instanceof UpdateFoodStoryErrors.MedicalRecordRepoError)
            return left(new UpdateFoodStoryErrors.MedicalRecordRepoError(e.err.message));
         else return left(new AppError.UnexpectedError(e));
      }
   }

   private async getMedicalRecord(medicalRecordId: AggregateID): Promise<MedicalRecord> {
      try {
         return await this.medicalRecordRepo.getById(medicalRecordId);
      } catch (e) {
         throw new UpdateFoodStoryErrors.MedicalRecordNotFoundError(e, medicalRecordId);
      }
   }

   private updateFoodStory(foodStory: FoodStory, data: Partial<CreateFoodStoryProps>) {
      if (data?.bedtime) foodStory.bedtime = new Time(data.bedtime);
      if (data?.wakeUpTime) foodStory.wakeUpTime = new Time(data.wakeUpTime);
      if (data?.numberOfMealsPerDay) foodStory.numberOfMealsPerDay = data.numberOfMealsPerDay;
      if (data?.otherInformation) foodStory.otherInformation = data.otherInformation;
      this.updateCollection(foodStory.dietTypes, data?.dietTypes, foodStory.addDietType.bind(foodStory), foodStory.removeDietType.bind(foodStory));
      this.updateCollection(foodStory.allergies, data?.allergies, foodStory.addAllergy.bind(foodStory), foodStory.removeAllergy.bind(foodStory));
      this.updateCollection(
         foodStory.foodIntolerances,
         data?.foodIntolerances,
         foodStory.addFoodIntolerance.bind(foodStory),
         foodStory.removeFoodIntolerance.bind(foodStory),
      );
      this.updateCollection(
         foodStory.nutritionalDeficiencies,
         data?.nutritionalDeficiencies,
         foodStory.addNutritionalDeficience.bind(foodStory),
         foodStory.removeNutritionalDeficience.bind(foodStory),
      );
      this.updateFavoriteFoods(foodStory, data?.foodAversions);
      this.updateFavoriteFoods(foodStory, data?.favoriteFoods);
      if (data?.waterConsumption) foodStory.waterConsumption = new WaterConsumptionRange(data.waterConsumption);
   }
   private updateCollection(
      currentCollection: AggregateID[],
      newCollection: AggregateID[] | undefined,
      addMethod: (item: AggregateID) => void,
      removeMethod: (item: AggregateID) => void,
   ) {
      if (!newCollection) return;

      const currentSet = new Set(currentCollection);
      const newSet = new Set(newCollection);

      newSet.forEach((item) => !currentSet.has(item) && addMethod(item));
      currentSet.forEach((item) => !newSet.has(item) && removeMethod(item));
   }
   private updateFavoriteFoods(foodStory: FoodStory, favoriteFoods: IFavoriteFood[] | undefined) {
      if (!favoriteFoods) return;

      const currentFavoriteFoods = new Set(foodStory.favoriteFoods.map((favFood: IFavoriteFood) => JSON.stringify(favFood)));
      const newFavoriteFoods = new Set(favoriteFoods.map((favFood: IFavoriteFood) => JSON.stringify(favFood)));

      newFavoriteFoods.forEach((favFoodStr: string) => {
         const favFood = new FavoriteFood(JSON.parse(favFoodStr) as IFavoriteFood);
         if (!currentFavoriteFoods.has(favFoodStr)) foodStory.addFavoriteFood(favFood);
      });

      currentFavoriteFoods.forEach((favFoodStr: string) => {
         const favFood = new FavoriteFood(JSON.parse(favFoodStr) as IFavoriteFood);
         if (!newFavoriteFoods.has(favFoodStr)) foodStory.removeFavoriteFood(favFood);
      });
   }

   private updateFoodAversions(foodStory: FoodStory, foodAversions: IAversion[] | undefined) {
      if (!foodAversions) return;

      const currentFoodAversions = new Set(foodStory.foodAversions.map((avFood: IAversion) => JSON.stringify(avFood)));
      const newFoodAversions = new Set(foodAversions.map((avFood: IAversion) => JSON.stringify(avFood)));

      newFoodAversions.forEach((avFoodStr: string) => {
         const avFood = new Aversion(JSON.parse(avFoodStr) as IAversion);
         if (!currentFoodAversions.has(avFoodStr)) foodStory.addFoodAversion(avFood);
      });

      currentFoodAversions.forEach((avFoodStr: string) => {
         const avFood = new Aversion(JSON.parse(avFoodStr) as IAversion);
         if (!newFoodAversions.has(avFoodStr)) foodStory.removeFoodAversion(avFood);
      });
   }
   private getFoodStoryFromMedicalRecord(medicalRecord: MedicalRecord): FoodStory {
      const medicalRecordProps = medicalRecord.getProps();
      return medicalRecordProps.foodStory;
   }

   private updateMedicalRecord(medicalRecord: MedicalRecord, foodStory: FoodStory) {
      medicalRecord.updateFoodStory(foodStory);
   }

   private async saveMedicalRecord(medicalRecord: MedicalRecord) {
      try {
         await this.medicalRecordRepo.save(medicalRecord);
      } catch (e) {
         throw new UpdateFoodStoryErrors.MedicalRecordRepoError(e);
      }
   }
}
