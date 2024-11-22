import { AggregateID } from "@shared";
import { Nutrient } from "./../../../domain";

export interface NutrientRepository {
   save(nutrient: Nutrient, trx?: any): Promise<void>;
   getById(nutrientId: AggregateID): Promise<Nutrient>;
   getAllNutrient(): Promise<Nutrient[]>;
   delete(nutrientId: AggregateID, trx?: any): Promise<void>;
}
