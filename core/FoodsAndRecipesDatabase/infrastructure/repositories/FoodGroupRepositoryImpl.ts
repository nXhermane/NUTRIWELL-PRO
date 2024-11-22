import { SQLiteDatabase } from "expo-sqlite";
import { FoodGroupRepository } from "./interfaces/FoodGroupRepository";
import { AggregateID, Mapper } from "@shared";
import { FoodGroup } from "../../domain";
import { FoodGroupPersistenceType } from "./types";
import { FoodGroupDto } from "../dtos";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { foodGroups } from "../database/foodAndRecipe.schema";
import { FoodGroupRepositoryError } from "./errors/FoodGroupRepositoryErrors";
import { eq } from "drizzle-orm";

export class FoodGroupRepositoryImpl implements FoodGroupRepository {
   private db;
   constructor(
      expo: SQLiteDatabase,
      private mapper: Mapper<FoodGroup, FoodGroupPersistenceType, FoodGroupDto>,
   ) {
      this.db = drizzle(expo);
   }
   async save(foodgroup: FoodGroup, trx?: any): Promise<void> {
      try {
         const persistenceFoodGroup = this.mapper.toPersistence(foodgroup);
         const exist = await this.checkIfExist(foodgroup.id);
         if (!exist) await (trx || this.db).insert(foodGroups).values(persistenceFoodGroup);
         else
            await (trx || this.db)
               .update(foodGroups)
               .set(persistenceFoodGroup)
               .where(eq(foodGroups.groupId, foodgroup.id as string));
      } catch (error) {
         throw new FoodGroupRepositoryError("Erreur lors du sauvegarde du FoodGroup", error as Error, { foodgroup });
      }
   }
   async getById(foodGroupId: AggregateID): Promise<FoodGroup> {
      try {
         const foodGroup = await this.db
            .select()
            .from(foodGroups)
            .where(eq(foodGroups.groupId, foodGroupId as string))
            .get();
         return this.mapper.toDomain(foodGroup);
      } catch (error) {
         throw new FoodGroupRepositoryError("Erreur lors de la recuperation de foodGroup ", error as Error, { foodGroupId });
      }
   }
   async delete(foodGroupId: AggregateID, trx?: any): Promise<void> {
      try {
         await (trx || this.db).delete(foodGroups).where(eq(foodGroups.groupId, foodGroupId as string));
      } catch (error) {
         throw new FoodGroupRepositoryError("Erreur lors de suppression du foodGroup", error as Error, { foodGroupId });
      }
   }
   private async checkIfExist(foodGroupId: AggregateID): Promise<boolean> {
      const foodGroup = await this.db
         .select()
         .from(foodGroups)
         .where(eq(foodGroups.groupId, foodGroupId as string))
         .get();
      return !!foodGroup;
   }
}
