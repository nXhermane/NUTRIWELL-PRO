import { SQLiteDatabase } from "expo-sqlite";
import { NutritionFormular } from "../../domain/entities/NutritionFormular";
import { NutritionFormularRepository } from "./interfaces/NutritionFormularRepository";
import { Mapper } from "@/core/shared";
import { NutritionFormularPersistence } from "./types";
import { NutritionFormularDto } from "../dtos/NutritionFormularDto";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { nutritionFormulars } from "../database/patientNeeds";
import { eq, or } from "drizzle-orm";
import { NutritionFormularRepositoryError, NutritionFormularRepositoryNotFoundException } from "./errors/NutritionFormularRepositoryErrors";

export class NutritionFormularRepositoryImpl implements NutritionFormularRepository {
   private db;
   constructor(
      expo: SQLiteDatabase,
      private mapper: Mapper<NutritionFormular, NutritionFormularPersistence, NutritionFormularDto>,
   ) {
      this.db = drizzle(expo);
   }
   async getByIdOrName(idOrName: string): Promise<NutritionFormular> {
      try {
         const formular = await this.db
            .select()
            .from(nutritionFormulars)
            .where(or(eq(nutritionFormulars.id, idOrName), eq(nutritionFormulars.name, idOrName)))
            .get();
         if (!formular)
            throw new NutritionFormularRepositoryNotFoundException("Aucune formule nutritionelle trouvee pour cet identifiant", undefined, idOrName);
         return this.mapper.toDomain(formular);
      } catch (error) {
         throw new NutritionFormularRepositoryError("Erreur lors de le recuperation du formule nutritionelle", error as Error, { idOrName });
      }
   }
   async save(nutritionFormular: NutritionFormular, trx?: any): Promise<void> {
      try {
         const { id, ...otherProps } = this.mapper.toPersistence(nutritionFormular);
         const exist = await this.checkIfexist(id as string);
         if (!exist) {
            await (trx || this.db).insert(nutritionFormulars).values({ id: id as string, ...otherProps });
         } else {
            await (trx || this.db).update(nutritionFormulars).set({ id: id as string, ...otherProps });
         }
      } catch (error) {
         throw new NutritionFormularRepositoryError("Erreur lors du sauvegarde du formule nutritionelle", error as Error, { nutritionFormular });
      }
   }
   async delete(id: string, trx?: any): Promise<void> {
      try {
         await (trx || this.db).delete(nutritionFormulars).where(eq(nutritionFormulars.id, id));
      } catch (error) {
         throw new NutritionFormularRepositoryError("Erreur lors de le suppression de la formule nutritionelle", error as Error, { id });
      }
   }
   async getAll(): Promise<NutritionFormular[]> {
      try {
         const formulars = await this.db.select().from(nutritionFormulars).all();
         return formulars.map((formular) => this.mapper.toDomain(formular));
      } catch (error) {
         throw new NutritionFormularRepositoryError("Erreur lors de le recuperation des formules nutritionelles", error as Error, {});
      }
   }
   private async checkIfexist(id: string): Promise<boolean> {
      const formular = await this.db.select().from(nutritionFormulars).where(eq(nutritionFormulars.id, id));
      return !!formular;
   }
}
