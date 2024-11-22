import { medicalStories } from "./../database/medicalRecord.schema";
import { MedicalStoryRepository } from "./interfaces";
import { AggregateID, Result, Mapper, Paginated } from "@shared";
import { MedicalStory } from "./../../domain";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import { SQLiteDatabase } from "expo-sqlite";
import { MedicalStoryPersistenceType } from "./types";
import { MedicalStoryDto } from "./../dtos";
import { MedicalStoryRepositoryError, MedicalStoryRepositoryNotFoundException } from "./errors/MedicalStoryRepositoryError";
export class MedicalStoryRepositoryImpl implements MedicalStoryRepository {
   private db;
   constructor(
      expo: SQLiteDatabase,
      private mapper: Mapper<MedicalStory, MedicalStoryPersistenceType, MedicalStoryDto>,
   ) {
      this.db = drizzle(expo);
   }
   async save(medicalStory: MedicalStory, trx?: any): Promise<void> {
      try {
         const persistenceMedicalStory = this.mapper.toPersistence(medicalStory);
         const exist = await this.checkIfExist(persistenceMedicalStory.id);
         if (!exist) await (trx || this.db).insert(medicalStories).values(persistenceMedicalStory);
         else
            await (trx || this.db)
               .update(medicalStories)
               .set(persistenceMedicalStory)
               .where(eq(medicalStories.id, persistenceMedicalStory.id as string));
      } catch (e: any) {
         throw new MedicalStoryRepositoryError("Erreur lors de la sauvegarde de l'histoire medicale(MedicalStory)", e as Error, {});
      }
   }
   async getById(medicalStoryId: AggregateID): Promise<MedicalStory> {
      try {
         const medicalStory = await this.db
            .select()
            .from(medicalStories)
            .where(eq(medicalStories.id, medicalStoryId as string))
            .get();
         if (!medicalStory)
            throw new MedicalStoryRepositoryNotFoundException("MedicalStory non trouvée pour l'ID donné", new Error(""), {
               medicalStoryId,
            });
         return this.mapper.toDomain(medicalStory as MedicalStoryPersistenceType);
      } catch (e: any) {
         throw new MedicalStoryRepositoryError("Erreur lors de la récupération du MedicalStory par ID", e as Error, {
            medicalStoryId,
         });
      }
   }
   async delete(medicalStoryId: AggregateID, trx?: any): Promise<void> {
      try {
         await (trx || this.db).delete(medicalStories).where(eq(medicalStories.id, medicalStoryId as string));
      } catch (error: any) {
         throw new MedicalStoryRepositoryError("Erreur lors de la suppression du MedicalStory", error as Error, {});
      }
   }
   private async checkIfExist(medicalStoryId: AggregateID): Promise<boolean> {
      const medicalStory = await this.db
         .select()
         .from(medicalStories)
         .where(eq(medicalStories.id, medicalStoryId as string))
         .get();
      return !!medicalStory;
   }
}
