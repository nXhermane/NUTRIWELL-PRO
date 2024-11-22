import { foodDiaries } from "./../database/medicalRecord.schema";
import { FoodDiaryRepository } from "./interfaces";
import { AggregateID, Result, Mapper, Paginated, DateManager } from "@shared";
import { FoodDiary } from "./../../domain";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import { SQLiteDatabase } from "expo-sqlite";
import { FoodDiaryPersistenceType } from "./types";
import { FoodDiaryDto } from "./../dtos";
import { FoodDiaryError, FoodDiaryNotFoundException } from "./errors/FoodDiaryError";
export class FoodDiaryRepositoryImpl implements FoodDiaryRepository {
   private db;
   constructor(
      expo: SQLiteDatabase,
      private mapper: Mapper<FoodDiary, FoodDiaryPersistenceType, FoodDiaryDto>,
   ) {
      this.db = drizzle(expo);
   }
   async save(foodDiary: FoodDiary, trx?: any): Promise<void> {
      try {
         const persistenceFoodDiary = this.mapper.toPersistence(foodDiary);
         const exist = await this.checkIfExist(persistenceFoodDiary.id);
         if (!exist) await (trx || this.db).insert(foodDiaries).values(persistenceFoodDiary);
         else
            await (trx || this.db)
               .update(foodDiaries)
               .set(persistenceFoodDiary)
               .where(eq(foodDiaries.id, persistenceFoodDiary.id as string));
      } catch (e: any) {
         throw new FoodDiaryError("Erreur lors de la sauvegarde du Journal Alimentaire (FoodDiary)", e as Error, {});
      }
   }
   async getById(foodDiaryId: AggregateID): Promise<FoodDiary> {
      try {
         const foodDiary = await this.db
            .select()
            .from(foodDiaries)
            .where(eq(foodDiaries.id, foodDiaryId as string))
            .get();
         if (!foodDiary)
            throw new FoodDiaryNotFoundException("FoodDiary non trouvée pour l'ID donné", new Error(""), {
               foodDiaryId,
            });
         const { date, ...otherProps } = foodDiary;
         return this.mapper.toDomain({ ...otherProps, date: DateManager.formatDate(date as Date) } as FoodDiaryPersistenceType);
      } catch (e: any) {
         throw new FoodDiaryError("Erreur lors de la récupération du FoodDiary par ID", e as Error, {
            foodDiaryId,
         });
      }
   }
   async delete(foodDiaryId: AggregateID, trx?: any): Promise<void> {
      try {
         await (trx || this.db).delete(foodDiaries).where(eq(foodDiaries.id, foodDiaryId as string));
      } catch (error: any) {
         throw new FoodDiaryError("Erreur lors de la suppression du FoodDiary", error as Error, {});
      }
   }
   private async checkIfExist(foodDiaryId: AggregateID): Promise<boolean> {
      const foodDiary = await this.db
         .select()
         .from(foodDiaries)
         .where(eq(foodDiaries.id, foodDiaryId as string))
         .get();
      return !!foodDiary;
   }
}
