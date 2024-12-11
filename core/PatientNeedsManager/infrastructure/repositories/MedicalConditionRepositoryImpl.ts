import { AggregateID, Mapper } from "@/core/shared";
import { MedicalCondition } from "../../domain/entities/MedicalCondition";
import { MedicalConditionRepository } from "./interfaces/MedicalConditionRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { MedicalConditionPersistence } from "./types";
import { MedicalConditionDto } from "../dtos/MedicalConditionDto";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { medicalConditions } from "../database/patientNeeds";
import { eq } from "drizzle-orm";
import { MedicalConditionRepositoryError, MedicalConditionRepositoryNotFoundException } from "./errors/MedicalConditionRepositoryErrors";

export class MedicalConditionRepositoryImpl implements MedicalConditionRepository {
    private db;
    constructor(expo: SQLiteDatabase, private mapper: Mapper<MedicalCondition, MedicalConditionPersistence, MedicalConditionDto>) {
        this.db = drizzle(expo)
    }
    async getById(medicalConditionId: AggregateID): Promise<MedicalCondition> {
        try {
            const medicalConditionRow = await this.db.select().from(medicalConditions).where(eq(medicalConditions.id, medicalConditionId as string)).get()
            if (!medicalConditionRow) throw new MedicalConditionRepositoryNotFoundException("MedicalCondition not found.")
            return this.mapper.toDomain(medicalConditionRow)
        } catch (error) {
            throw new MedicalConditionRepositoryError("Erreur lors de la recupperation du Condition Medical.", error as Error, { medicalConditionId })
        }
    }
    async save(medicalCondition: MedicalCondition, trx?: any): Promise<void> {
        try {
            const medicalConditionPersistence = this.mapper.toPersistence(medicalCondition)
            const exist = await this.checkIfExist(medicalCondition.id)
            if (!exist) await (trx || this.db).insert(medicalConditions).values(medicalConditionPersistence)
            else await (trx || this.db).update(medicalConditions).set(medicalConditionPersistence).where(eq(medicalConditions.id, medicalConditionPersistence.id))
        } catch (error) {
            throw new MedicalConditionRepositoryError("Erreur lors du sauvegarde du Condition Medical.", error as Error, { medicalCondition })
        }
    }
    async delete(medicalConditionId: AggregateID, trx?: any): Promise<void> {
        try {
            await (trx || this.db).delete(medicalConditions).where(eq(medicalConditions.id, medicalConditionId as string))
        } catch (error) {
            throw new MedicalConditionRepositoryError("Erreur lors de la suppression du Condition medical.", error as Error, { medicalConditionId })
        }
    }
    private async checkIfExist(medicalConditionId: AggregateID): Promise<boolean> {
        const medicalCondition = await this.db.select().from(medicalConditions).where(eq(medicalConditions.id, medicalConditionId as string)).get()
        return !!medicalCondition;
    }

}