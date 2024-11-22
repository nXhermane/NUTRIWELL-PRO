import { patientMeasurements } from "./../database/medicalRecord.schema";
import { PatientMeasurementRepository } from "./interfaces";
import { AggregateID, Result, Mapper, Paginated } from "@shared";
import { PatientMeasurements } from "./../../domain";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import { SQLiteDatabase } from "expo-sqlite";
import { PatientMeasurementPersistenceType } from "./types";
import { PatientMeasurementDto } from "./../dtos";
import { PatientMeasurementRepositoryError, PatientMeasurementRepositoryNotFoundException } from "./errors/PatientMeasurementRepositoryError";
export class PatientMeasurementRepositoryImpl implements PatientMeasurementRepository {
   private db;
   constructor(
      expo: SQLiteDatabase,
      private mapper: Mapper<PatientMeasurements, PatientMeasurementPersistenceType, PatientMeasurementDto>,
   ) {
      this.db = drizzle(expo);
   }
   async save(patientMeasure: PatientMeasurements, trx?: any): Promise<void> {
      try {
         const persistencePatientMeasurements = this.mapper.toPersistence(patientMeasure);
         const exist = await this.checkIfExist(persistencePatientMeasurements.id);
         if (!exist) await (trx || this.db).insert(patientMeasurements).values(persistencePatientMeasurements);
         else
            await (trx || this.db)
               .update(patientMeasurements)
               .set(persistencePatientMeasurements)
               .where(eq(patientMeasurements.id, persistencePatientMeasurements.id as string));
      } catch (e: any) {
         throw new PatientMeasurementRepositoryError("Erreur lors de la sauvegarde des mesures du patient (PatientMeasurements)", e as Error, {});
      }
   }
   async getById(patientMeasureId: AggregateID): Promise<PatientMeasurements> {
      try {
         const patientMeasure = await this.db
            .select()
            .from(patientMeasurements)
            .where(eq(patientMeasurements.id, patientMeasureId as string))
            .get();
         if (!patientMeasure)
            throw new PatientMeasurementRepositoryNotFoundException("PatientMeasurements non trouvée pour l'ID donné", new Error(""), {
               patientMeasureId,
            });
         return this.mapper.toDomain(patientMeasure as PatientMeasurementPersistenceType);
      } catch (e: any) {
         throw new PatientMeasurementRepositoryError("Erreur lors de la récupération du PatientMeasurements par ID", e as Error, {
            patientMeasureId,
         });
      }
   }
   async delete(patientMeasureId: AggregateID, trx?: any): Promise<void> {
      try {
         await (trx || this.db).delete(patientMeasurements).where(eq(patientMeasurements.id, patientMeasureId as string));
      } catch (error: any) {
         throw new PatientMeasurementRepositoryError("Erreur lors de la suppression du PatientMeasurements", error as Error, {});
      }
   }
   private async checkIfExist(patientMeasureId: AggregateID): Promise<boolean> {
      const patientMeasure = await this.db
         .select()
         .from(patientMeasurements)
         .where(eq(patientMeasurements.id, patientMeasureId as string))
         .get();
      return !!patientMeasure;
   }
}
