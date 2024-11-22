import { consultationInformations } from "./../database/medicalRecord.schema";
import { ConsultationInformationRepository } from "./interfaces";
import { AggregateID, Result, Mapper, Paginated } from "@shared";
import { ConsultationInformation } from "./../../domain";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import { SQLiteDatabase } from "expo-sqlite";
import { ConsultationInformationPersistenceType } from "./types";
import { ConsultationInformationDto } from "./../dtos";
import { ConsultationInformationError, ConsultationInformationNotFoundException } from "./errors/ConsultationInformationError";
export class ConsultationInformationRepositoryImpl implements ConsultationInformationRepository {
   private db;
   constructor(
      expo: SQLiteDatabase,
      private mapper: Mapper<ConsultationInformation, ConsultationInformationPersistenceType, ConsultationInformationDto>,
   ) {
      this.db = drizzle(expo);
   }
   async save(consultationInfo: ConsultationInformation, trx?: any): Promise<void> {
      try {
         const persistenceConsutationInfo = this.mapper.toPersistence(consultationInfo);
         const exist = await this.checkIfExist(persistenceConsutationInfo.id);
         if (!exist) await (trx || this.db).insert(consultationInformations).values(persistenceConsutationInfo);
         else
            await (trx || this.db)
               .update(consultationInformations)
               .set(persistenceConsutationInfo)
               .where(eq(consultationInformations.id, persistenceConsutationInfo.id as string));
      } catch (e: any) {
         throw new ConsultationInformationError(
            "Erreur lors de la sauvegarde des Information de Consultation(ConsultationInformation)",
            e as Error,
            {},
         );
      }
   }
   async getById(consultationInfoId: AggregateID): Promise<ConsultationInformation> {
      try {
         const consultationInfo = await this.db
            .select()
            .from(consultationInformations)
            .where(eq(consultationInformations.id, consultationInfoId as string))
            .get();
         if (!consultationInfo)
            throw new ConsultationInformationNotFoundException("ConsultationInformation non trouvée pour l'ID donné", new Error(""), {
               consultationInfoId,
            });
         return this.mapper.toDomain(consultationInfo as ConsultationInformationPersistenceType);
      } catch (e: any) {
         throw new ConsultationInformationError("Erreur lors de la récupération du ConsultationInformation par ID", e as Error, {
            consultationInfoId,
         });
      }
   }
   async delete(consultationInfoId: AggregateID, trx?: any): Promise<void> {
      try {
         await (trx || this.db).delete(consultationInformations).where(eq(consultationInformations.id, consultationInfoId as string));
      } catch (error: any) {
         throw new ConsultationInformationError("Erreur lors de la suppression du ConsultationInformation", error as Error, {});
      }
   }
   private async checkIfExist(consultationInfoId: AggregateID): Promise<boolean> {
      const consutationInfo = await this.db
         .select()
         .from(consultationInformations)
         .where(eq(consultationInformations.id, consultationInfoId as string))
         .get();
      return !!consutationInfo;
   }
}
