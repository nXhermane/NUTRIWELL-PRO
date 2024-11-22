import { AggregateID, Mapper } from "@/core/shared";
import { StandardObjective } from "../../domain/aggregate/StandardObjective";
import { StandardObjectiveRepository } from "./interfaces/StandardObjectiveRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { StandardObjectivePersistenceType } from "../types";
import { StandardObjectiveDto } from "../dtos/StandardObjectiveDto";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { standardObjectives } from "../database/standardRecommendation";
import { eq } from "drizzle-orm";
import { StandardObjectiveError, StandardObjectiveNotFoundException } from "./errors/StandardObjectiveErrors";

export class StandardObjectiveRepositoryImpl implements StandardObjectiveRepository {
    private db
    constructor(expo: SQLiteDatabase, private mapper: Mapper<StandardObjective, StandardObjectivePersistenceType, StandardObjectiveDto>) {
        this.db = drizzle(expo)
    }
    async save(objective: StandardObjective): Promise<void> {
        try {
            const objectivePersistence = this.mapper.toPersistence(objective)
            const exist = await this.checkIfExist(objectivePersistence.id)
            if (!exist) await this.db.insert(standardObjectives).values(objectivePersistence)
            else await this.db.update(standardObjectives).set(objectivePersistence).where(eq(standardObjectives.id, objectivePersistence.id))
        } catch (error) {
            throw new StandardObjectiveError("Erreur lors du sauvegarde de l'objective standard.", error as Error, {
                objective
            })
        }
    }
    async getById(objectiveId: AggregateID): Promise<StandardObjective> {
        try {
            const objectiveRow = await this.db.select().from(standardObjectives).where(eq(standardObjectives.id, objectiveId as string)).get()
            if (!objectiveRow) throw new StandardObjectiveNotFoundException("Objective Standard non trouvée.")
            return this.mapper.toDomain(objectiveRow)
        } catch (error) {
            throw new StandardObjectiveError("Erreur lors de la récuperation de l'objective standard", error as Error, {
                objectiveId
            })
        }
    }
    async getAll(): Promise<StandardObjective[]> {
        try {
            const objectivesRows = await this.db.select().from(standardObjectives).all()
            return objectivesRows.map(objectiveRow => this.mapper.toDomain(objectiveRow))
        } catch (error) {
            throw new StandardObjectiveError("Erreur lors de la récuperation de toutes les objectives standards", error as Error)
        }
    }
    async delete(objectiveId: AggregateID): Promise<void> {
        try {
            await this.db.delete(standardObjectives).where(eq(standardObjectives.id, objectiveId as string))
        } catch (error) {
            throw new StandardObjectiveError("Erreur lors de la suppression de l'objective standard.")
        }
    }
    private async checkIfExist(objectiveId: AggregateID): Promise<boolean> {
        const objective = await this.db.select().from(standardObjectives).where(eq(standardObjectives.id, objectiveId as string))
        return !!objective
    }

}