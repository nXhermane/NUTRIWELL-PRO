import { objectives } from "./../database/medicalRecord.schema";
import { ObjectiveRepository } from "./interfaces";
import { AggregateID, Mapper } from "@shared";
import { Objective } from "./../../domain";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import { SQLiteDatabase } from "expo-sqlite";
import { ObjectivePersistenceType } from "./types";
import { ObjectiveDto } from "./../dtos";
import { ObjectiveRepositoryError, ObjectiveRepositoryNotFoundException } from "./errors/ObjectiveRepositoryError";
export class ObjectiveRepositoryImpl implements ObjectiveRepository {
   private db;
   constructor(
      expo: SQLiteDatabase,
      private mapper: Mapper<Objective, ObjectivePersistenceType, ObjectiveDto>,
   ) {
      this.db = drizzle(expo);
   }
   async save(objective: Objective, trx?: any): Promise<void> {
      try {
         const persistenceObjective = this.mapper.toPersistence(objective);
         const exist = await this.checkIfExist(persistenceObjective.id);
         if (!exist) await (trx || this.db).insert(objectives).values(persistenceObjective);
         else
            await (trx || this.db)
               .update(objectives)
               .set(persistenceObjective)
               .where(eq(objectives.id, persistenceObjective.id as string));
      } catch (e: any) {
         throw new ObjectiveRepositoryError("Erreur lors de la sauvegarde de l'Objective (Objective)", e as Error, {});
      }
   }
   async getById(objectiveId: AggregateID): Promise<Objective> {
      try {
         const objective = await this.db
            .select()
            .from(objectives)
            .where(eq(objectives.id, objectiveId as string))
            .get();
         if (!objective)
            throw new ObjectiveRepositoryNotFoundException("Objective non trouvée pour l'ID donné", new Error(""), {
               objectiveId,
            });
         return this.mapper.toDomain(objective as ObjectivePersistenceType);
      } catch (e: any) {
         throw new ObjectiveRepositoryError("Erreur lors de la récupération du Objective par ID", e as Error, {
            objectiveId,
         });
      }
   }
   async delete(objectiveId: AggregateID, trx?: any): Promise<void> {
      try {
         await (trx || this.db).delete(objectives).where(eq(objectives.id, objectiveId as string));
      } catch (error: any) {
         throw new ObjectiveRepositoryError("Erreur lors de la suppression du Objective", error as Error, {});
      }
   }
   private async checkIfExist(objectiveId: AggregateID): Promise<boolean> {
      const objective = await this.db
         .select()
         .from(objectives)
         .where(eq(objectives.id, objectiveId as string))
         .get();
      return !!objective;
   }
}
