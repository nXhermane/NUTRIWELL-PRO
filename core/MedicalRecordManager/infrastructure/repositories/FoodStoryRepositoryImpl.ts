import { foodStories } from "./../database/medicalRecord.schema";
import { FoodStoryRepository } from "./interfaces";
import { AggregateID, Result, Mapper, Paginated, DateManager } from "@shared";
import { FoodStory } from "./../../domain";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import { SQLiteDatabase } from "expo-sqlite";
import { FoodStoryPersistenceType } from "./types";
import { FoodStoryDto } from "./../dtos";
import { FoodStoryRepositoryError, FoodStoryRepositoryNotFoundException } from "./errors/FoodStoryRepositoryError";
export class FoodStoryRepositoryImpl implements FoodStoryRepository {
   private db;
   constructor(
      expo: SQLiteDatabase,
      private mapper: Mapper<FoodStory, FoodStoryPersistenceType, FoodStoryDto>,
   ) {
      this.db = drizzle(expo);
   }
   async save(foodStory: FoodStory, trx?: any): Promise<void> {
      try {
         const persistenceFoodStory = this.mapper.toPersistence(foodStory);
         const exist = await this.checkIfExist(persistenceFoodStory.id);
         if (!exist) await (trx || this.db).insert(foodStories).values(persistenceFoodStory);
         else
            await (trx || this.db)
               .update(foodStories)
               .set(persistenceFoodStory)
               .where(eq(foodStories.id, persistenceFoodStory.id as string));
      } catch (e: any) {
         throw new FoodStoryRepositoryError("Erreur lors de la sauvegarde de l'histoire alimentaire(FoodStory)", e as Error, {});
      }
   }
   async getById(foodStoryId: AggregateID): Promise<FoodStory> {
      try {
         const foodStory = await this.db
            .select()
            .from(foodStories)
            .where(eq(foodStories.id, foodStoryId as string))
            .get();
         if (!foodStory)
            throw new FoodStoryRepositoryNotFoundException("FoodStory non trouvée pour l'ID donné", new Error(""), {
               foodStoryId,
            });

         return this.mapper.toDomain(foodStory as FoodStoryPersistenceType);
      } catch (e: any) {
         throw new FoodStoryRepositoryError("Erreur lors de la récupération du FoodStory par ID", e as Error, {
            foodStoryId,
         });
      }
   }
   async delete(foodStoryId: AggregateID, trx?: any): Promise<void> {
      try {
         await (trx || this.db).delete(foodStories).where(eq(foodStories.id, foodStoryId as string));
      } catch (error: any) {
         throw new FoodStoryRepositoryError("Erreur lors de la suppression du FoodStory", error as Error, {});
      }
   }
   private async checkIfExist(foodStoryId: AggregateID): Promise<boolean> {
      const foodStory = await this.db
         .select()
         .from(foodStories)
         .where(eq(foodStories.id, foodStoryId as string))
         .get();
      return !!foodStory;
   }
}
