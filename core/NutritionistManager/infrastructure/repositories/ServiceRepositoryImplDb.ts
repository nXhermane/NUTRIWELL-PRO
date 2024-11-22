import { services } from "./../database/nutritionist.schema";
import { ServiceRepository } from "./interfaces";
import { AggregateID, Result, Mapper, Paginated } from "@shared";
import { Service } from "./../../domain";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import { SQLiteDatabase } from "expo-sqlite";
import { ServicePersistenceType } from "./types";
import { ServiceDto } from "./../dtos";
import { ServiceError, ServiceNotFoundException } from "./errors/ServiceRepositoryErrors";
export class ServiceRepositoryImpl implements ServiceRepository {
   private db;
   constructor(
      expo: SQLiteDatabase,
      private mapper: Mapper<Service, ServicePersistenceType, ServiceDto>,
   ) {
      this.db = drizzle(expo);
   }
   async save(service: Service, trx?: any): Promise<void> {
      try {
         const persistenceService = this.mapper.toPersistence(service);
         const exist = await this.checkIfExist(persistenceService.id);
         if (!exist) await (trx || this.db).insert(services).values(persistenceService);
         else
            await (trx || this.db)
               .update(services)
               .set(persistenceService)
               .where(eq(services.id, persistenceService.id as string));
      } catch (e: any) {
         throw new ServiceError("Erreur lors de la sauvegarde du service (Service)", e as Error, {});
      }
   }
   async getById(serviceId: AggregateID): Promise<Service> {
      try {
         const service = await this.db
            .select()
            .from(services)
            .where(eq(services.id, serviceId as string))
            .get();
         if (!service)
            throw new ServiceNotFoundException("Service non trouvée pour l'ID donné", new Error(""), {
               serviceId,
            });
         return this.mapper.toDomain(service as ServicePersistenceType);
      } catch (e: any) {
         throw new ServiceError("Erreur lors de la récupération du Service par ID", e as Error, {
            serviceId,
         });
      }
   }
   async delete(serviceId: AggregateID, trx?: any): Promise<void> {
      try {
         await (trx || this.db).delete(services).where(eq(services.id, serviceId as string));
      } catch (error: any) {
         throw new ServiceError("Erreur lors de la suppression du Service", error as Error, {});
      }
   }
   private async checkIfExist(serviceId: AggregateID): Promise<boolean> {
      const service = await this.db
         .select()
         .from(services)
         .where(eq(services.id, serviceId as string))
         .get();
      return !!service;
   }
}
