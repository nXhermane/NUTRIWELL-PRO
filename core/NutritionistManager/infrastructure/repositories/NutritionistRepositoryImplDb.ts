import { nutritionists } from "./../database/nutritionist.schema";
import { NutritionistRepository, ConsultationPlaceRepository, ServiceRepository } from "./interfaces";
import { AggregateID, Mapper, Email } from "@shared";
import { Nutritionist, Service, ConsultationPlace } from "./../../domain";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq, or } from "drizzle-orm";
import { SQLiteDatabase } from "expo-sqlite";
import { NutritionistPersistenceType, NutritionistRecordPersistenceType } from "./types";
import { NutritionistDto } from "./../dtos";
import { NutritionistRepositoryError, NutritionistRepositoryNotFoundException } from "./errors/NutritionistRepositoryErros";

interface Repositories {
   consultationPlaceRepo: ConsultationPlaceRepository;
   serviceRepo: ServiceRepository;
}

export class NutritionistRepositoryImplDb implements NutritionistRepository {
   private db;

   constructor(
      expo: SQLiteDatabase,
      private mapper: Mapper<Nutritionist, NutritionistPersistenceType, NutritionistDto>,
      private repositories: Repositories,
   ) {
      this.db = drizzle(expo);
   }

   async save(nutritionist: Nutritionist): Promise<void> {
      const { services, consultationPlaces } = nutritionist.getProps();
      const persistenceNutritionsit = this.mapper.toPersistence(nutritionist);
      const exist = await this.checkIfExist(persistenceNutritionsit.id);

      try {
         await this.db.transaction(async (tx) => {
            await Promise.all(services.map((service) => this.repositories.serviceRepo.save(service, tx)));
            await Promise.all(consultationPlaces.map((consultationPlace) => this.repositories.consultationPlaceRepo.save(consultationPlace, tx)));
            if (!exist) {
               await tx.insert(nutritionists).values(persistenceNutritionsit);
            } else {
               await tx
                  .update(nutritionists)
                  .set(persistenceNutritionsit)
                  .where(eq(nutritionists.id, persistenceNutritionsit.id as string));
            }
         });
      } catch (e: any) {
         throw new NutritionistRepositoryError("Erreur lors de la sauvegarde du Nutritionist", e as Error, {});
      }
   }

   async getById(nutritionistId: AggregateID): Promise<Nutritionist> {
      try {
         const nutritionist = await this.db
            .select()
            .from(nutritionists)
            .where(eq(nutritionists.id, nutritionistId as string))
            .get();

         if (!nutritionist) {
            throw new NutritionistRepositoryNotFoundException("Nutritionist non trouvée pour l'ID donné", new Error(""), {
               nutritionistId,
            });
         }
         const record = await this.__getAllDataToMakeRecord(nutritionist as unknown as NutritionistPersistenceType);
         return this.mapper.toDomain(record);
      } catch (e: any) {
         throw new NutritionistRepositoryError("Erreur lors de la récupération du Nutritionist par ID", e as Error, { nutritionistId });
      }
   }
   async getByEmail(nutritionistEmail: Email): Promise<Nutritionist> {
      try {
         const nutritionist = await this.db
            .select()
            .from(nutritionists)
            .where(eq(nutritionists.email, nutritionistEmail.getValue() as string))
            .get();

         if (!nutritionist) {
            throw new NutritionistRepositoryNotFoundException("Nutritionist non trouvée pour l'email donné", new Error(""), {
               nutritionistEmail,
            });
         }
         const record = await this.__getAllDataToMakeRecord(nutritionist as unknown as NutritionistPersistenceType);
         return this.mapper.toDomain(record);
      } catch (e: any) {
         throw new NutritionistRepositoryError("Erreur lors de la récupération du Nutritionist par l'email", e as Error, { nutritionistEmail });
      }
   }

   async delete(nutritionistId: AggregateID): Promise<void> {
      try {
         const nutritionistRaw = await this.db
            .select()
            .from(nutritionists)
            .where(eq(nutritionists.id, nutritionistId as string))
            .get();

         await this.db.transaction(async (tx) => {
            const { consultationPlaceIds, serviceIds } = nutritionistRaw as NutritionistPersistenceType;
            await Promise.all(
               consultationPlaceIds.map((consultationPlaceId: AggregateID) =>
                  this.repositories.consultationPlaceRepo.delete(consultationPlaceId, tx),
               ),
            );
            await Promise.all(serviceIds.map((serviceId: AggregateID) => this.repositories.serviceRepo.delete(serviceId, tx)));
            await tx.delete(nutritionists).where(eq(nutritionists.id, nutritionistId as string));
         });
      } catch (error: any) {
         throw new NutritionistRepositoryError("Erreur lors de la suppression du MedicalRecord", error as Error, {});
      }
   }

   async savePasswordHash(nutritionistId: AggregateID, passwordHash: string, trx?: any): Promise<void> {
      const exist = await this.checkIfExist(nutritionistId);
      try {
         if (!exist) {
            await this.db
               .update(nutritionists)
               .set({ password: passwordHash })
               .where(eq(nutritionists.id, nutritionistId as string));
         }
      } catch (e: any) {
         throw new NutritionistRepositoryError("Erreur lors de la sauvegarde du password du Nutritionit", e as Error, {});
      }
   }

   async getPasswordHash(nutritionistId: AggregateID): Promise<string | null> {
      try {
         const nutritionist = await this.db
            .select()
            .from(nutritionists)
            .where(eq(nutritionists.id, nutritionistId as string))
            .get();
         if (!nutritionist) {
            throw new NutritionistRepositoryNotFoundException("Nutritionist non trouvée pour l'ID donné", new Error(""), {
               nutritionistId,
            });
         }
         return nutritionist.password;
      } catch (e: any) {
         throw new NutritionistRepositoryError("Erreur lors de la récupération du Nutritionist par l'ID", e as Error, { nutritionistId });
      }
   }
   async saveGoogleId(nutritionistId: AggregateID, googleId: string, trx?: any): Promise<void> {
      const exist = await this.checkIfExist(nutritionistId);
      try {
         if (!exist) {
            await this.db
               .update(nutritionists)
               .set({ googleId: googleId })
               .where(eq(nutritionists.id, nutritionistId as string));
         }
      } catch (e: any) {
         throw new NutritionistRepositoryError("Erreur lors de la sauvegarde du Google Id du Nutritionit", e as Error, {});
      }
   }

   async getGoogleId(nutritionistId: AggregateID): Promise<string | null> {
      try {
         const nutritionist = await this.db
            .select()
            .from(nutritionists)
            .where(eq(nutritionists.id, nutritionistId as string))
            .get();
         if (!nutritionist) {
            throw new NutritionistRepositoryNotFoundException("Nutritionist non trouvée pour l'ID donné", new Error(""), {
               nutritionistId,
            });
         }
         return nutritionist.googleId;
      } catch (e: any) {
         throw new NutritionistRepositoryError("Erreur lors de la récupération du Nutritionist par l'ID", e as Error, { nutritionistId });
      }
   }

   private async __getAllDataToMakeRecord(nutritionist: NutritionistPersistenceType): Promise<NutritionistRecordPersistenceType> {
      const { consultationPlaceIds, serviceIds, ...otherNutritionistProps } = nutritionist;
      const consultationPlaces = await Promise.all(
         consultationPlaceIds.map((consultationPlaceId: AggregateID) => this.repositories.consultationPlaceRepo.getById(consultationPlaceId)),
      );
      const services = await Promise.all(serviceIds.map((serviceId: AggregateID) => this.repositories.serviceRepo.getById(serviceId)));
      return { ...otherNutritionistProps, services, consultationPlaces } as NutritionistRecordPersistenceType;
   }
   private async checkIfExist(nutritionistId: AggregateID): Promise<boolean> {
      const nutritionist = await this.db
         .select()
         .from(nutritionists)
         .where(eq(nutritionists.id, nutritionistId as string))
         .get();
      return !!nutritionist;
   }
}
