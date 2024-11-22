import { personalAndSocialStories } from "./../database/medicalRecord.schema";
import { PersonalAndSocialStoryRepository } from "./interfaces";
import { AggregateID, Result, Mapper, Paginated } from "@shared";
import { PersonalAndSocialStory } from "./../../domain";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import { SQLiteDatabase } from "expo-sqlite";
import { PersonalAndSocialStoryPersistenceType } from "./types";
import { PersonalAndSocialStoryDto } from "./../dtos";
import {
   PersonalAndSocialStoryRepositoryError,
   PersonalAndSocialStoryRepositoryNotFoundException,
} from "./errors/PersonalAndSocialStoryRepositoryError";
export class PersonalAndSocialStoryRepositoryImpl implements PersonalAndSocialStoryRepository {
   private db;
   constructor(
      expo: SQLiteDatabase,
      private mapper: Mapper<PersonalAndSocialStory, PersonalAndSocialStoryPersistenceType, PersonalAndSocialStoryDto>,
   ) {
      this.db = drizzle(expo);
   }
   async save(personalAndSocialStory: PersonalAndSocialStory, trx?: any): Promise<void> {
      try {
         const persistencePersonalAndSocialStory = this.mapper.toPersistence(personalAndSocialStory);
         const exist = await this.checkIfExist(persistencePersonalAndSocialStory.id);
         if (!exist) await (trx || this.db).insert(personalAndSocialStories).values(persistencePersonalAndSocialStory);
         else
            await (trx || this.db)
               .update(personalAndSocialStories)
               .set(persistencePersonalAndSocialStory)
               .where(eq(personalAndSocialStories.id, persistencePersonalAndSocialStory.id as string));
      } catch (e: any) {
         throw new PersonalAndSocialStoryRepositoryError(
            "Erreur lors de la sauvegarde de l'histoire personnelle et sociale (PersonalAndSocialStory)",
            e as Error,
            {},
         );
      }
   }
   async getById(personalAndSocialStoryId: AggregateID): Promise<PersonalAndSocialStory> {
      try {
         const personalAndSocialStory = await this.db
            .select()
            .from(personalAndSocialStories)
            .where(eq(personalAndSocialStories.id, personalAndSocialStoryId as string))
            .get();
         if (!personalAndSocialStory)
            throw new PersonalAndSocialStoryRepositoryNotFoundException("PersonalAndSocialStory non trouvée pour l'ID donné", new Error(""), {
               personalAndSocialStoryId,
            });
         return this.mapper.toDomain(personalAndSocialStory as PersonalAndSocialStoryPersistenceType);
      } catch (e: any) {
         throw new PersonalAndSocialStoryRepositoryError("Erreur lors de la récupération du PersonalAndSocialStory par ID", e as Error, {
            personalAndSocialStoryId,
         });
      }
   }
   async delete(personalAndSocialStoryId: AggregateID, trx?: any): Promise<void> {
      try {
         await (trx || this.db).delete(personalAndSocialStories).where(eq(personalAndSocialStories.id, personalAndSocialStoryId as string));
      } catch (error: any) {
         throw new PersonalAndSocialStoryRepositoryError("Erreur lors de la suppression du PersonalAndSocialStory", error as Error, {});
      }
   }
   private async checkIfExist(personalAndSocialStoryId: AggregateID): Promise<boolean> {
      const personalAndSocialStory = await this.db
         .select()
         .from(personalAndSocialStories)
         .where(eq(personalAndSocialStories.id, personalAndSocialStoryId as string))
         .get();
      return !!personalAndSocialStory;
   }
}
