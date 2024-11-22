import { PatientMeasurementCategory } from "./../../../../constants";
import { AggregateID } from "./../../../../domain";
import { MeasurementTypeRepository } from "./interfaces";
import { MeasurementType } from "./../../domain";
import { MeasurementTypeRepositoryError, MeasurementTypeRepositoryNotFoundException } from "./errors/MeasurementTypeRepositoryError";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import { SQLiteDatabase } from "expo-sqlite";
import { measurementTypes } from "./../database/nutritionData.schema";
export class MeasurementTypeRepositoryImplDb implements MeasurementTypeRepository {
   private db;

   constructor(expo: SQLiteDatabase) {
      this.db = drizzle(expo);
   }

   async save(measuementType: MeasurementType): Promise<void> {
      try {
         const measurementTypePersistence = {
            id: measuementType.id as string,
            name: measuementType.name,
            nameF: measuementType.nameF,
            measureCategory: measuementType.measureCategory as "Antropometry" | "MedicalAnalysis" | "BodyComposition",
            measureCode: measuementType.code,
            unit: measuementType.unit,
         };
         const exist = await this.checkIfExist(measurementTypePersistence.id);
         if (!exist) await this.db.insert(measurementTypes).values(measurementTypePersistence);
         else await this.db.update(measurementTypes).set(measurementTypePersistence).where(eq(measurementTypes.id, measurementTypePersistence.id));
      } catch (error) {
         throw new MeasurementTypeRepositoryError("Erreur lors de la sauvegarde du type de mesure.", error as Error, {});
      }
   }

   async getById(measurementTypeId: AggregateID): Promise<MeasurementType> {
      try {
         const measurementType = await this.db
            .select()
            .from(measurementTypes)
            .where(eq(measurementTypes.id, measurementTypeId as string))
            .get();
         if (!measurementType)
            throw new MeasurementTypeRepositoryNotFoundException("Type de mesure non trouvée pour l'ID donné", new Error(""), { measurementTypeId });
         return this.mapToDomain(measurementType);
      } catch (error) {
         throw new MeasurementTypeRepositoryError("Erreur lors de la récupération du type de mesure par ID", error as Error, { measurementTypeId });
      }
   }

   async getAll(measurementCategory?: "Antropometry" | "MedicalAnalysis" | "BodyComposition"): Promise<MeasurementType[]> {
      try {
         const query = this.db.select().from(measurementTypes);
         if (measurementCategory) query.where(eq(measurementTypes.measureCategory, measurementCategory));
         const allMeasurementType = await query.all();
         if (allMeasurementType.length === 0) throw new MeasurementTypeRepositoryNotFoundException("Aucun type dr mesure trouvé", new Error(""), {});
         return allMeasurementType.map((measurementType: any) => this.mapToDomain(measurementType));
      } catch (error) {
         throw new MeasurementTypeRepositoryError("Erreur lors de la récupération de tous les types de mesure", error as Error, {});
      }
   }

   async getAllId(measurementCategory?: "Antropometry" | "MedicalAnalysis" | "BodyComposition"): Promise<{ id: AggregateID; code: string }[]> {
      const measurementTypes = await this.getAll(measurementCategory);
      return measurementTypes.map((measurementType: MeasurementType) => ({ id: measurementType.id, code: measurementType.code }));
   }

   async delete(measurementTypeId: AggregateID): Promise<void> {
      try {
         await this.db.delete(measurementTypes).where(eq(measurementTypes.id, measurementTypeId as string));
      } catch (error) {
         throw new MeasurementTypeRepositoryError("Erreur lors de la suppression du type de mesure", error as Error, { measurementTypeId });
      }
   }

   private async checkIfExist(measurementTypeId: AggregateID): Promise<boolean> {
      const measurementType = await this.db
         .select()
         .from(measurementTypes)
         .where(eq(measurementTypes.id, measurementTypeId as string))
         .get();
      return !!measurementType;
   }

   private mapToDomain(measurementTypePersistence: any): MeasurementType {
      const { id, createdAt, updatedAt, measureCode, measureCategory, nameF, name, unit } = measurementTypePersistence;
      return new MeasurementType({
         id,
         createdAt,
         updatedAt,
         props: {
            name,
            unit,
            measureCategory: measureCategory as PatientMeasurementCategory,
            code: measureCode,
            nameTranslate: { inFrench: nameF },
         },
      });
   }
}
