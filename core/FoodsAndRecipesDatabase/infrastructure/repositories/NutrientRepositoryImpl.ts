import { SQLiteDatabase } from "expo-sqlite";
import { NutrientRepository } from "./interfaces/NutrientRepository";
import { AggregateID, Mapper } from "@shared";
import { Nutrient } from "../../domain";
import { NutrientPersistenceType } from "./types";
import { NutrientDto } from "../dtos";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { nutrientNames } from "../database/foodAndRecipe.schema";
import { eq } from "drizzle-orm";
import { NutrientRepositoryError } from "./errors/NutrientRepositoryErrors";
import { FoodgroupRepositoryNotFoundException } from "./errors/FoodGroupRepositoryErrors";

export class NutrientRepositoryImpl implements NutrientRepository {
   private db;
   constructor(
      expo: SQLiteDatabase,
      private mapper: Mapper<Nutrient, NutrientPersistenceType, NutrientDto>,
   ) {
      this.db = drizzle(expo);
   }
   async save(nutrient: Nutrient, trx?: any): Promise<void> {
      try {
         const persistenceNutrient = this.mapper.toPersistence(nutrient);
         const exist = await this.checkIfExist(nutrient.id);
         if (!exist) await (trx || this.db).insert(nutrientNames).values(persistenceNutrient);
         else
            await (trx || this.db)
               .update(nutrientNames)
               .set(persistenceNutrient)
               .where(eq(nutrientNames.nutrientId, nutrient.id as string));
      } catch (error) {
         throw new NutrientRepositoryError("Erreur lors du sauvegarde du nutrient ", error as Error, {
            nutrient,
         });
      }
   }
   async getById(nutrientId: AggregateID): Promise<Nutrient> {
      try {
         const nutrient = await this.db
            .select()
            .from(nutrientNames)
            .where(eq(nutrientNames.nutrientId, nutrientId as string))
            .get();
         return this.mapper.toDomain(nutrient);
      } catch (error) {
         throw new NutrientRepositoryError("Erreur lors de la recuperation du Nutrient ", error as Error, { nutrientId });
      }
   }
   async getAllNutrient(): Promise<Nutrient[]> {
      try {
         const nutrients = await this.db.select().from(nutrientNames).all();
         if (nutrients.length === 0) throw new FoodgroupRepositoryNotFoundException("Erreur , il n'existe pas de nutrient ");
         return nutrients.map((value) => this.mapper.toDomain(value));
      } catch (error) {
         throw new NutrientRepositoryError("Erreur lors de la recuperation du Nutrient ", error as Error, {});
      }
   }
   async delete(nutrientId: AggregateID, trx?: any): Promise<void> {
      try {
         await (trx || this.db).delete(nutrientNames).where(eq(nutrientNames.nutrientId, nutrientId as string));
      } catch (error) {
         throw new NutrientRepositoryError("Erreur lors de la suppression  de nutrient", error as Error, { nutrientId });
      }
   }
   private async checkIfExist(nutrientId: AggregateID): Promise<boolean> {
      const nutrient = await this.db
         .select()
         .from(nutrientNames)
         .where(eq(nutrientNames.nutrientId, nutrientId as string))
         .get();
      return !!nutrient;
   }
}
