import { consultationPlaces } from "./../database/nutritionist.schema";
import { ConsultationPlaceRepository } from "./interfaces";
import { AggregateID, Result, Mapper, Paginated } from "@shared";
import { ConsultationPlace } from "./../../domain";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import { SQLiteDatabase } from "expo-sqlite";
import { ConsultationPlacePersistenceType } from "./types";
import { ConsultationPlaceDto } from "./../dtos";
import { ConsultationPlaceError, ConsultationPlaceNotFoundException } from "./errors/ConsultationPlaceRepositoryErrors";
export class ConsultationPlaceRepositoryImpl implements ConsultationPlaceRepository {
   private db;
   constructor(
      expo: SQLiteDatabase,
      private mapper: Mapper<ConsultationPlace, ConsultationPlacePersistenceType, ConsultationPlaceDto>,
   ) {
      this.db = drizzle(expo);
   }
   async save(consultationPlace: ConsultationPlace, trx?: any): Promise<void> {
      try {
         const persistenceConsultationPlace = this.mapper.toPersistence(consultationPlace);
         const exist = await this.checkIfExist(persistenceConsultationPlace.id);
         if (!exist) await (trx || this.db).insert(consultationPlaces).values(persistenceConsultationPlace);
         else
            await (trx || this.db)
               .update(consultationPlaces)
               .set(persistenceConsultationPlace)
               .where(eq(consultationPlaces.id, persistenceConsultationPlace.id as string));
      } catch (e: any) {
         throw new ConsultationPlaceError("Erreur lors de la sauvegarde des Place de Consultation(ConsultationPlace)", e as Error, {});
      }
   }
   async getById(consultationPlaceId: AggregateID): Promise<ConsultationPlace> {
      try {
         const consultationPlace = await this.db
            .select()
            .from(consultationPlaces)
            .where(eq(consultationPlaces.id, consultationPlaceId as string))
            .get();
         if (!consultationPlace)
            throw new ConsultationPlaceNotFoundException("ConsultationPlace non trouvée pour l'ID donné", new Error(""), {
               consultationPlaceId,
            });
         return this.mapper.toDomain(consultationPlace as ConsultationPlacePersistenceType);
      } catch (e: any) {
         throw new ConsultationPlaceError("Erreur lors de la récupération du ConsultationPlace par ID", e as Error, {
            consultationPlaceId,
         });
      }
   }
   async delete(consultationPlaceId: AggregateID, trx?: any): Promise<void> {
      try {
         await (trx || this.db).delete(consultationPlaces).where(eq(consultationPlaces.id, consultationPlaceId as string));
      } catch (error: any) {
         throw new ConsultationPlaceError("Erreur lors de la suppression du ConsultationPlace", error as Error, {});
      }
   }
   private async checkIfExist(consultationPlaceId: AggregateID): Promise<boolean> {
      const consultationPlace = await this.db
         .select()
         .from(consultationPlaces)
         .where(eq(consultationPlaces.id, consultationPlaceId as string))
         .get();
      return !!consultationPlace;
   }
}
