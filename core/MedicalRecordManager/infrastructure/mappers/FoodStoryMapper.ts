import { FoodStory, FavoriteFood, WaterConsumptionRange, IWaterConsumptionRange, IFavoriteFood, IAversion, Aversion } from "./../../domain";
import { Mapper, Time, AggregateID } from "@shared";
import { FoodStoryPersistenceType } from "./../repositories/types";
import { FoodStoryDto } from "./../dtos/FoodStoryDto";
export class FoodStoryMapper implements Mapper<FoodStory, FoodStoryPersistenceType, FoodStoryDto> {
   toPersistence(entity: FoodStory): FoodStoryPersistenceType {
      return {
         id: entity.id,
         bedtime: entity.bedtime,
         wakeUpTime: entity.wakeUpTime,
         dietTypes: entity.dietTypes,
         favoriteFoods: entity.favoriteFoods,
         foodAversions: entity.foodAversions,
         allergies: entity.allergies,
         foodIntolerances: entity.foodIntolerances,
         nutritionalDeficiencies: entity.nutritionalDeficiencies,
         waterConsumption: entity.waterConsumption,
         numberOfMealsPerDay: entity.numberOfMealsPerDay,
         otherInformation: entity.otherInformation,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: FoodStoryPersistenceType): FoodStory {
      const bedtime = new Time(record.bedtime);
      const wakeUpTime = new Time(record.wakeUpTime);
      const dietTypes = new Set(record.dietTypes as AggregateID[]);
      const allergies = new Set(record.allergies as AggregateID[]);
      const foodIntolerances = new Set(record.foodIntolerances as AggregateID[]);
      const nutritionalDeficiencies = new Set(record.nutritionalDeficiencies as AggregateID[]);
      const waterData = record.waterConsumption as IWaterConsumptionRange;
      const waterConsumption = new WaterConsumptionRange(waterData);
      const numberOfMealsPerDay = record.numberOfMealsPerDay;
      const otherInformation = record.otherInformation;
      const favoriteFoodsData = record.favoriteFoods as IFavoriteFood[];
      const favoriteFoods = favoriteFoodsData.map((favFood: IFavoriteFood) => new FavoriteFood(favFood));
      const foodAversionsData = record.foodAversions as IAversion[];
      const foodAversions = foodAversionsData.map((foodAv: IAversion) => new Aversion(foodAv));
      const { id, createdAt, updatedAt } = record;
      return new FoodStory({
         id,
         createdAt,
         updatedAt,
         props: {
            bedtime,
            wakeUpTime,
            dietTypes,
            allergies,
            foodIntolerances,
            nutritionalDeficiencies,
            waterConsumption,
            numberOfMealsPerDay,
            otherInformation,
            favoriteFoods,
            foodAversions,
         },
      });
   }
   toResponse(entity: FoodStory): FoodStoryDto {
      return this.toPersistence(entity) as FoodStoryDto;
   }
}
