import { AggregateID } from "@/core/shared";
import { FoodGroup } from "./../../../domain";

export interface FoodGroupRepository {
   save(foodgroup: FoodGroup,trx?:any): Promise<void>;
   getById(foodGroupId: AggregateID): Promise<FoodGroup>;
   delete(foodGroupId: AggregateID,trx?:any): Promise<void>;
}
