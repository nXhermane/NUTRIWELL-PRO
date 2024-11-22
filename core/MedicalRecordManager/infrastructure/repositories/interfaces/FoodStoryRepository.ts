import { FoodStory } from "./../../../domain";
import { AggregateID, Paginated } from "@shared";
export interface FoodStoryRepository {
   save(foodStory: FoodStory, trx?: any): Promise<void>;
   getById(foodStoryId: AggregateID): Promise<FoodStory>;
   delete(foodStoryId: AggregateID, trx?: any): Promise<void>;
}
