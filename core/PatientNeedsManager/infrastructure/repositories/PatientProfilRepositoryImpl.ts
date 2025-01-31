import { AggregateDomainEvent, AggregateID, Mapper } from "@/core/shared";
import { PatientProfil } from "../../domain/aggregates/PatientProfil";
import { PatientProfilRepository } from "./interfaces/PatientProfilRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { PatientProfilPersistence } from "./types";
import { PatientProfilDto } from "../dtos/PatientProfilDto";
import { MedicalConditionRepository } from "./interfaces/MedicalConditionRepository";
import { ObjectiveRepository } from "./interfaces/ObjectiveRepository";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { patientProfils } from "../database/patientNeeds";
import { eq, or } from "drizzle-orm";
import { PatientProfilRepositoryError, PatientProfilRepositoryNotFoundException } from "./errors/PatientProfilRepositoryErrors";

export class PatientProfilRepositoryImpl implements PatientProfilRepository {
   private db;
   constructor(
      expo: SQLiteDatabase,
      private mapper: Mapper<PatientProfil, PatientProfilPersistence, PatientProfilDto>,
      private medicalConditionRepo: MedicalConditionRepository,
      private objectiveRepo: ObjectiveRepository,
   ) {
      this.db = drizzle(expo);
   }
   async getById(patientProfilOrPatientId: AggregateID): Promise<PatientProfil> {
      try {
         const patientProfil = await this.db
            .select()
            .from(patientProfils)
            .where(or(eq(patientProfils.id, patientProfilOrPatientId as string), eq(patientProfils.patientId, patientProfilOrPatientId as string)))
            .get();
         if (!patientProfil) throw new PatientProfilRepositoryNotFoundException("PatientProfil not found.");
         return this.mapper.toDomain(patientProfil);
      } catch (error) {
         throw new PatientProfilRepositoryError("Erreur lors de la recuperation de PatientProfil", error as Error, { patientProfilOrPatientId });
      }
   }
   async save(patientProfil: PatientProfil): Promise<void> {
      try {
         const patientProfilPersistence = this.mapper.toPersistence(patientProfil);
         const objectives = patientProfil.getObjectives();
         const medicalConditions = patientProfil.getMedicalConditions();
         const exist = await this.checkIfExist(patientProfil.id);
         await this.db.transaction(async (tx) => {
            await Promise.all(objectives.map((objective) => this.objectiveRepo.save(objective, tx)));
            await Promise.all(medicalConditions.map((medicalCondition) => this.medicalConditionRepo.save(medicalCondition, tx)));
            if (!exist) await tx.insert(patientProfils).values(patientProfilPersistence);
            else await tx.update(patientProfils).set(patientProfilPersistence).where(eq(patientProfils.id, patientProfilPersistence.id));
         });
        AggregateDomainEvent.get().dispatchEventsForMarkedAggregate(patientProfil.id) 
      } catch (error) {
         throw new PatientProfilRepositoryError("Erreur lors du sauvegarde du patientProfil.", error as Error, { patientProfil });
      }
   }
   async delete(patientProfilOrPatientId: AggregateID): Promise<void> {
      try {
         const patientProfil = await this.db
            .select()
            .from(patientProfils)
            .where(or(eq(patientProfils.id, patientProfilOrPatientId as string), eq(patientProfils.patientId, patientProfilOrPatientId as string)))
            .get();
         if (!patientProfil) throw new PatientProfilRepositoryNotFoundException("Le patientProfil a supprimer n'est pas trouvé.");
         await this.db.transaction(async (tx) => {
            await Promise.all(patientProfil.objectiveIds!.map((id) => this.objectiveRepo.delete(id, tx)));
            await Promise.all(patientProfil.medicalConditionIds!.map((id) => this.medicalConditionRepo.delete(id, tx)));
            await tx.delete(patientProfils).where(eq(patientProfils.id, patientProfil.id as string));
         });
         AggregateDomainEvent.get().dispatchEventsForMarkedAggregate(patientProfilOrPatientId)
      } catch (error) {
         throw new PatientProfilRepositoryError("Erreur lors de la suppression de patientProfil", error as Error, { patientProfilOrPatientId });
      }
   }

   private async checkIfExist(patientProfilId: AggregateID): Promise<boolean> {
      const patientProfil = await this.db
         .select()
         .from(patientProfils)
         .where(eq(patientProfils.id, patientProfilId as string))
         .get();
      return !!patientProfil;
   }
}
