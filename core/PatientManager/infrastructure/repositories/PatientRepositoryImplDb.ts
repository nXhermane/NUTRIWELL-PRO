import { patients } from "./../database/patient.schema";
import { PatientRepository } from "./interfaces/PatientRepository";
import { Patient } from "./../../domain";
import { AggregateID, Result, Mapper, Paginated, DomainEvents } from "@shared";
import { PatientDto } from "./../dtos/PatientDto";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import { SQLiteDatabase } from "expo-sqlite";
import { PatientPersistenceType } from "./types";
import { PatientRepositoryError, PatientRepositoryNotFoundException } from "./errors/PatientRepositoryError";
export class PatientRepositoryImplDb implements PatientRepository {
   private db;
   constructor(
      expo: SQLiteDatabase,
      private mapper: Mapper<Patient, PatientPersistenceType, PatientDto>,
   ) {
      this.db = drizzle(expo);
   }
   async save(patient: Patient): Promise<void> {
      try {
         const persistencePatient = this.mapper.toPersistence(patient);
         const exist = await this.checkIfExist(persistencePatient.id);
         if (!exist) await this.db.insert(patients).values(persistencePatient);
         else await this.db.update(patients).set(persistencePatient).where(eq(patients.id, persistencePatient.id));
         DomainEvents.dispatchEventsForAggregate(patient.id);
      } catch (e: any) {
         throw new PatientRepositoryError("Erreur lors de la sauvegarde du patient", e as Error, {});
      }
   }
   async getById(patientId: AggregateID): Promise<Patient> {
      try {
         const patient = await this.db
            .select()
            .from(patients)
            .where(eq(patients.id, patientId as string))
            .get();
         if (!patient) throw new PatientRepositoryNotFoundException("Patient non trouvée pour l'ID donné", new Error(""), { patientId });
         return this.mapper.toDomain(patient as PatientPersistenceType);
      } catch (e: any) {
         throw new PatientRepositoryError("Erreur lors de la récupération du patient par ID", e as Error, { patientId });
      }
   }
   async getAll(paginated?: Paginated): Promise<Patient[]> {
      try {
         const query = this.db.select().from(patients);
         if (paginated) query.limit(paginated.pageSize).offset(paginated.page);
         const allPatient = await query.all();
         if (allPatient.length === 0) {
            throw new PatientRepositoryNotFoundException("Aucun patient trouvé", new Error(""), {});
         }
         return allPatient.map((patient: PatientPersistenceType) => this.mapper.toDomain(patient));
      } catch (error: any) {
         throw new PatientRepositoryError("Erreur lors de la récupération de tous les patients", error as Error, {});
      }
   }
   async delete(patientId: AggregateID): Promise<void> {
      try {
         await this.db.delete(patients).where(eq(patients.id, patientId as string));
         DomainEvents.dispatchEventsForAggregate(patientId);
      } catch (error: any) {
         throw new PatientRepositoryError("Erreur lors de la suppression du patient", error as Error, {});
      }
   }

   private async checkIfExist(patientId: AggregateID): Promise<boolean> {
      const patient = await this.db
         .select()
         .from(patients)
         .where(eq(patients.id, patientId as string))
         .get();
      return !!patient;
   }
}
