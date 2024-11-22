import { FoodDiary } from "./../../../domain";
import { AggregateID, Paginated } from "@shared";
export interface FoodDiaryRepository {
   save(foodDiary: FoodDiary, trx?: any): Promise<void>;
   getById(foodDiaryId: AggregateID): Promise<FoodDiary>;
   delete(foodDiaryId: AggregateID, trx?: any): Promise<void>;
}
