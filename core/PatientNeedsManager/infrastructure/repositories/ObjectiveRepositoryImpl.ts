import { AggregateID, Mapper } from "@/core/shared";
import { Objective } from "../../domain/entities/Objective";
import { ObjectiveRepository } from "./interfaces/ObjectiveRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { ObjectivePersistence } from "./types";
import { ObjectiveDto } from "../dtos/ObjectiveDto";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { objectives } from "../database/patientNeeds";
import { eq } from "drizzle-orm";
import { ObjectiveRepositoryError, ObjectiveRepositoryNotFoundException } from "./errors/ObjectiveRepositoryErrors";

export class ObjectiveRepositoryImpl implements ObjectiveRepository {
    private db;
    constructor(expo: SQLiteDatabase, private mapper: Mapper<Objective, ObjectivePersistence, ObjectiveDto>) {
        this.db = drizzle(expo)
    }
    async getById(objectiveId: AggregateID): Promise<Objective> {
        try {
            const objectiveRow = await this.db.select().from(objectives).where(eq(objectives.id, objectiveId as string)).get()
            if (!objectiveRow) throw new ObjectiveRepositoryNotFoundException("Objective not found")
            return this.mapper.toDomain(objectiveRow)
        } catch (error) {
            throw new ObjectiveRepositoryError("Erreur lors de la recupperation de l'objective", error as Error, { objectiveId });
        }
    }
    async save(objective: Objective, trx?: any): Promise<void> {
        try {
            const persistenceObjective = this.mapper.toPersistence(objective)
            const exist = await this.checkIfExist(objective.id)
            if (!exist) await (trx || this.db).insert(objectives).values(persistenceObjective)
            else await (trx || this.db).update(objectives).set(persistenceObjective).where(eq(objectives.id, persistenceObjective.id))
        } catch (error) {
            throw new ObjectiveRepositoryError("Erreur lors du sauvegarde de l'objective.", error as Error, { objective })
        }
    }
    async delete(objectiveId: AggregateID, trx?: any): Promise<void> {
        try {
            await (trx || this.db).delete(objectives).where(eq(objectives.id, objectiveId as string))
        } catch (error) {
            throw new ObjectiveRepositoryError("Erreur lors de la suppression de l'objective.", error as Error, { objectiveId })
        }
    }
    private async checkIfExist(objectiveId: AggregateID): Promise<boolean> {
        const objective = await this.db.select().from(objectives).where(eq(objectives.id, objectiveId as string))
        return !!objective;
    }

}