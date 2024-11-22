import { SQLiteDatabase } from "expo-sqlite";
import { NutritionalReferenceValue } from "../../domain/entities/NutritionalReferenceValue";
import { NutritionalReferenceValueRepository } from "./interfaces/NutritionalReferenceValueRepository";
import { Mapper } from "@/core/shared";
import { NutritionalReferenceValuePersistence } from "./types";
import { NutritionalReferenceValueDto } from "../dtos/NutritionalReferenceValueDto";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { nutritionalReferencesValues } from "../database/patientNeeds";
import { eq, or } from "drizzle-orm";
import { NutritionalReferenceValueRepositoryError } from "./errors/NutritionalReferenceValueRepositoryError";

export class NutritionalReferenceValueRepositoryImpl implements NutritionalReferenceValueRepository {
   private db;
   constructor(
      expo: SQLiteDatabase,
      private mapper: Mapper<NutritionalReferenceValue, NutritionalReferenceValuePersistence, NutritionalReferenceValueDto>,
   ) {
      this.db = drizzle(expo);
   }
   async getByIdOrTagname(idOrTagname: string): Promise<NutritionalReferenceValue> {
      try {
         const nutritionalRefValue = await this.db
            .select()
            .from(nutritionalReferencesValues)
            .where(or(eq(nutritionalReferencesValues.id, idOrTagname), eq(nutritionalReferencesValues.tagname, idOrTagname)))
            .get();
         return this.mapper.toDomain(nutritionalRefValue);
      } catch (error) {
         throw new NutritionalReferenceValueRepositoryError("Erreur lors de la recuperation du valeur nutritionnelle de reference.", error as Error, {
            idOrTagname,
         });
      }
   }
   async save(nutritionalReferencesValue: NutritionalReferenceValue,trx?:any): Promise<void> {
      try {
         const { id, ...otherProps } = this.mapper.toPersistence(nutritionalReferencesValue);
         const exist = await this.checkIfExist(nutritionalReferencesValue.id as string);
         if (!exist) {
            await (trx||this.db).insert(nutritionalReferencesValues).values({ id: id as string, ...otherProps });
         } else {
            await (trx||this.db).update(nutritionalReferencesValues).set({ id: id as string, ...otherProps });
         }
      } catch (error) {
         throw new NutritionalReferenceValueRepositoryError("Erreur lors du sauvegarde du valeur nutritionnelle de reference.", error as Error, {
            nutritionalReferencesValue,
         });
      }
   }
   async delete(nutritionalReferencesValueId: string,trx?:any): Promise<void> {
      try {
         await (trx||this.db).delete(nutritionalReferencesValues).where(eq(nutritionalReferencesValues.id, nutritionalReferencesValueId));
      } catch (error) {
         throw new NutritionalReferenceValueRepositoryError("Erreur lors de la suppression du valeur nutritionnelle de reference.", error as Error, {
            nutritionalReferencesValueId,
         });
      }
   }
   async getAll(): Promise<NutritionalReferenceValue[]> {
      try {
         const nutRefValues = await this.db.select().from(nutritionalReferencesValues).all();
         return nutRefValues.map((nutritionalRefValue) => this.mapper.toDomain(nutritionalRefValue));
      } catch (error) {
         throw new NutritionalReferenceValueRepositoryError(
            "Erreur lors de la recuperation des valeurs nutritionnelles de reference.",
            error as Error,
            {},
         );
      }
   }
   private async checkIfExist(idOrTagname: string): Promise<boolean> {
      const nutritionalRefValue = await this.db
         .select()
         .from(nutritionalReferencesValues)
         .where(or(eq(nutritionalReferencesValues.id, idOrTagname), eq(nutritionalReferencesValues.tagname, idOrTagname)))
         .get();
      return !!nutritionalRefValue;
   }
}
