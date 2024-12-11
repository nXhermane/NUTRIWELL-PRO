import { AggregateID, Mapper } from "@/core/shared";
import { PatientNeedsModel } from "../../domain/entities/PatientNeedsModel";
import { PatientNeedsModelRepository } from "./interfaces/PatientNeedsModelRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { PatientNeedsModelPersistence } from "./types";
import { PatientNeedsModelDto } from "../dtos/PatientNeedsModelDto";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { patientNeedsModels } from "../database/patientNeeds";
import { eq } from "drizzle-orm";
import { PatientNeedsModelRepositoryError, PatientNeedsModelRepositoryNotFoundException } from "./errors/PatientNeedsModelRepositioryErrors";

export class PatientNeedsModelRepositoryImpl implements PatientNeedsModelRepository {
    private db;
    constructor(expo: SQLiteDatabase, private mapper: Mapper<PatientNeedsModel, PatientNeedsModelPersistence, PatientNeedsModelDto>) {
        this.db = drizzle(expo)
    }
    async save(patientNeedsModel: PatientNeedsModel, trx?: any): Promise<void> {
        try {
            const persistenceModel = this.mapper.toPersistence(patientNeedsModel)
            const exist = await this.checkIfExist(patientNeedsModel.id)
            if (!exist) await (trx || this.db).insert(patientNeedsModels).values(persistenceModel)
            else await (trx || this.db).update(patientNeedsModels).set(persistenceModel).where(eq(patientNeedsModels.id, persistenceModel.id))

        } catch (error) {
            throw new PatientNeedsModelRepositoryError("Erreur lors du sauvegarde du PatientNeedsModel.", error as Error, { patientNeedsModel })
        }
    }
    async delete(patientNeedsModelId: AggregateID, trx?: any): Promise<void> {
        try {
            await this.db.delete(patientNeedsModels).where(eq(patientNeedsModels.id, patientNeedsModelId as string))
        } catch (error) {
            throw new PatientNeedsModelRepositoryError("Erreur lors de la suppression du PatientNeedsModel.", error as Error, { patientNeedsModelId });
        }
    }
    async getAll(): Promise<PatientNeedsModel[]> {
        try {
            const modelRows = await this.db.select().from(patientNeedsModels).all()
            if (modelRows.length == 0) throw new PatientNeedsModelRepositoryNotFoundException("PatientNeedsModel not found.", new Error(), {})
            return modelRows.map(model => this.mapper.toDomain(model))
        } catch (error) {
            throw new PatientNeedsModelRepositoryError("Erreur lors de la recuperation de PatientNeedsModel.", error as Error, {})
        }
    }

    async getById(patientNeedsModelId: AggregateID): Promise<PatientNeedsModel> {
        try {
            const modelRow = await this.db.select().from(patientNeedsModels).where(eq(patientNeedsModels.id, patientNeedsModelId as string)).get()
            if (!modelRow) throw new PatientNeedsModelRepositoryNotFoundException("PatientNeedsModel not found.", new Error(), { patientNeedsModelId })
            return this.mapper.toDomain(modelRow)
        } catch (error) {
            throw new PatientNeedsModelRepositoryError("Erreur lors de la recuperation du patientNeedsModel.", error as Error, { patientNeedsModelId })
        }
    }
    private async checkIfExist(patientNeedsModelId: AggregateID): Promise<boolean> {
        const patientNeedsModel = await this.db.select().from(patientNeedsModels).where(eq(patientNeedsModels.id, patientNeedsModelId as string)).get()
        return !!patientNeedsModel
    }
} 