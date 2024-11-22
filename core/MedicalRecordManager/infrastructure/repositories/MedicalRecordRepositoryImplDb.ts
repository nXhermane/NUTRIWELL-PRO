import { medicalRecords } from "./../database/medicalRecord.schema";
import {
   MedicalRecordRepository,
   ConsultationInformationRepository,
   FoodDiaryRepository,
   FoodStoryRepository,
   MedicalStoryRepository,
   ObjectiveRepository,
   PatientMeasurementRepository,
   PersonalAndSocialStoryRepository,
} from "./interfaces";
import { AggregateID, DomainEvents, Mapper } from "@shared";
import { MedicalRecord } from "./../../domain";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq, or } from "drizzle-orm";
import { SQLiteDatabase } from "expo-sqlite";
import { MedicalRecordPersistenceType, MedicalRecordPersistenceRecordType } from "./types";
import { MedicalRecordDto } from "./../dtos";
import { MedicalRecordRepositoryError, MedicalRecordRepositoryNotFoundException } from "./errors/MedicalRecordRepositoryError";

interface Repositories {
   consultationInfoRepo: ConsultationInformationRepository;
   foodDiaryRepo: FoodDiaryRepository;
   foodStoryRepo: FoodStoryRepository;
   medicalStoryRepo: MedicalStoryRepository;
   objectiveRepo: ObjectiveRepository;
   patientMeasurementRepo: PatientMeasurementRepository;
   personalAndSocialStoryRepo: PersonalAndSocialStoryRepository;
}

export class MedicalRecordRepositoryImpl implements MedicalRecordRepository {
   private db;

   constructor(
      expo: SQLiteDatabase,
      private mapper: Mapper<MedicalRecord, MedicalRecordPersistenceType, MedicalRecordDto>,
      private repositories: Repositories,
   ) {
      this.db = drizzle(expo);
   }

   async save(medicalRecord: MedicalRecord): Promise<void> {
      const { consultationInformation, foodStory, medicalStory, measure, personalAndSocialStory, foodDiaries, objectives } = medicalRecord.getProps();
      const persistenceMedicalRecord = this.mapper.toPersistence(medicalRecord);
      const exist = await this.checkIfExist(persistenceMedicalRecord.id);

      try {
         await this.db.transaction(async (tx) => {
            await this.repositories.consultationInfoRepo.save(consultationInformation, tx);
            await this.repositories.foodStoryRepo.save(foodStory, tx);
            await this.repositories.medicalStoryRepo.save(medicalStory, tx);
            await this.repositories.patientMeasurementRepo.save(measure, tx);
            await this.repositories.personalAndSocialStoryRepo.save(personalAndSocialStory, tx);
            await Promise.all(foodDiaries.map((foodDiary) => this.repositories.foodDiaryRepo.save(foodDiary, tx)));
            await Promise.all(objectives.map((obj) => this.repositories.objectiveRepo.save(obj, tx)));

            if (!exist) {
               await tx.insert(medicalRecords).values(persistenceMedicalRecord);
            } else {
               await tx
                  .update(medicalRecords)
                  .set(persistenceMedicalRecord)
                  .where(eq(medicalRecords.id, persistenceMedicalRecord.id as string));
            }
         });
         DomainEvents.dispatchEventsForAggregate(medicalRecord.id);
      } catch (e: any) {
         throw new MedicalRecordRepositoryError("Erreur lors de la sauvegarde du dossier medicale (MedicalRecord)", e as Error, {});
      }
   }

   async getById(medicalRecordOrPatientId: AggregateID): Promise<MedicalRecord> {
      try {
         const medicalRecord = await this.db
            .select()
            .from(medicalRecords)
            .where(or(eq(medicalRecords.id, medicalRecordOrPatientId as string), eq(medicalRecords.patientId, medicalRecordOrPatientId as string)))
            .get();

         if (!medicalRecord) {
            throw new MedicalRecordRepositoryNotFoundException("MedicalRecord non trouvée pour l'ID donné", new Error(""), {
               medicalRecordOrPatientId,
            });
         }
         const record = await this.__getAllDataToMakeRecord(medicalRecord as unknown as MedicalRecordPersistenceType);
         return this.mapper.toDomain(record);
      } catch (e: any) {
         throw new MedicalRecordRepositoryError("Erreur lors de la récupération du MedicalRecord par ID", e as Error, { medicalRecordOrPatientId });
      }
   }

   async delete(medicalRecordId: AggregateID): Promise<void> {
      try {
         const medicalRecordRaw = await this.db
            .select()
            .from(medicalRecords)
            .where(eq(medicalRecords.id, medicalRecordId as string))
            .get();

         await this.db.transaction(async (tx) => {
            const {
               medicalStoryId,
               foodStoryId,
               consultationInformationId,
               patientMeasurementId,
               objectiveIds,
               foodDiaryIds,
               personalAndSocialStorieId,
            } = medicalRecordRaw as MedicalRecordPersistenceType;
            await this.repositories.medicalStoryRepo.delete(medicalStoryId, tx);
            await this.repositories.foodStoryRepo.delete(foodStoryId, tx);
            await this.repositories.consultationInfoRepo.delete(consultationInformationId, tx);
            await this.repositories.patientMeasurementRepo.delete(patientMeasurementId, tx);
            await this.repositories.personalAndSocialStoryRepo.delete(personalAndSocialStorieId, tx);
            await Promise.all(objectiveIds.map((objId) => this.repositories.objectiveRepo.delete(objId, tx)));
            await Promise.all(foodDiaryIds.map((foodDiaryId) => this.repositories.foodDiaryRepo.delete(foodDiaryId, tx)));
            await tx.delete(medicalRecords).where(eq(medicalRecords.id, medicalRecordId as string));
         });
         DomainEvents.dispatchEventsForAggregate(medicalRecordId);
      } catch (error: any) {
         throw new MedicalRecordRepositoryError("Erreur lors de la suppression du MedicalRecord", error as Error, {});
      }
   }
   private async __getAllDataToMakeRecord(medicalRecord: MedicalRecordPersistenceType): Promise<MedicalRecordPersistenceRecordType> {
      const {
         medicalStoryId,
         foodStoryId,
         consultationInformationId,
         patientMeasurementId,
         objectiveIds,
         foodDiaryIds,
         personalAndSocialStorieId,
         id,
         status,
         patientId,
         ...otherMedicalRecordProps
      } = medicalRecord;
      const medicalStory = await this.repositories.medicalStoryRepo.getById(medicalStoryId);
      const foodStory = await this.repositories.foodStoryRepo.getById(foodStoryId);
      const consultationInformation = await this.repositories.consultationInfoRepo.getById(consultationInformationId);
      const patientMeasurements = await this.repositories.patientMeasurementRepo.getById(patientMeasurementId);
      const personalAndSocialStory = await this.repositories.personalAndSocialStoryRepo.getById(personalAndSocialStorieId);
      const objectives = await Promise.all(objectiveIds.map((objId) => this.repositories.objectiveRepo.getById(objId)));
      const foodDiaries = await Promise.all(foodDiaryIds.map((foodDiaryId) => this.repositories.foodDiaryRepo.getById(foodDiaryId)));

      return {
         medicalStory,
         foodStory,
         consultationInformation,
         patientMeasurements,
         personalAndSocialStory,
         objectives,
         foodDiaries,
         id: id as unknown as AggregateID,
         patientId: patientId as unknown as AggregateID,
         status: status as unknown as "Active" | "New" | "Inactive",
         ...otherMedicalRecordProps,
      } as MedicalRecordPersistenceRecordType;
   }
   private async checkIfExist(medicalRecordId: AggregateID): Promise<boolean> {
      const medicalRecord = await this.db
         .select()
         .from(medicalRecords)
         .where(eq(medicalRecords.id, medicalRecordId as string))
         .get();
      return !!medicalRecord;
   }
}
