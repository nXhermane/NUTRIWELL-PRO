import { AggregateID, Mapper } from "@/core/shared";
import { StandardMedicalCondition } from "../../domain/aggregate/StandardMedicalCondition";
import { StandardMedicalConditionRepository } from "./interfaces/StandardMedicalConditionRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { StandardMedicalConditionDto } from "../dtos/StandardMedicalCondititonDto";
import { StandardMedicalConditionPersistenceType } from "../types";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { standardMedicalConditions } from "../database/standardRecommendation";
import { eq } from "drizzle-orm";
import { StandardMedicalConditionError, StandardMedicalConditionNotFoundException } from "./errors/StandardMedicalConditonErrors";

export class StandardMedicalConditionRepositoryImpl implements StandardMedicalConditionRepository {
    private db
    constructor(expo: SQLiteDatabase, private mapper: Mapper<StandardMedicalCondition, StandardMedicalConditionPersistenceType, StandardMedicalConditionDto>) {
        this.db = drizzle(expo)
    }
    async save(medicalCondition: StandardMedicalCondition): Promise<void> {
        try {
            const medicalConditionPersistence = this.mapper.toPersistence(medicalCondition)
            const exist = await this.checkIfExist(medicalCondition.id)
            if (exist) {
                await this.db.update(standardMedicalConditions).set(medicalConditionPersistence).where(eq(standardMedicalConditions, medicalConditionPersistence.id))
            } else {
                await this.db.insert(standardMedicalConditions).values(medicalConditionPersistence)
            }
        } catch (error) {
            throw new StandardMedicalConditionError("Erreur lors du sauvegarde du condition medicale standard.", error as Error, {
                medicalCondition
            })
        }
    }
    async getById(medicalConditionId: AggregateID): Promise<StandardMedicalCondition> {
        try {
            const rowMedicalCondition = await this.db.select().from(standardMedicalConditions).where(eq(standardMedicalConditions, medicalConditionId as string)).get()
            if (!rowMedicalCondition) throw new StandardMedicalConditionNotFoundException("Condition medicale standard non trouvé")
            return this.mapper.toDomain(rowMedicalCondition)
        } catch (error) {
            throw new StandardMedicalConditionError("Erreur lors de la récupération de la condition medicale standard", error as Error, {
                medicalConditionId
            })
        }
    }
    async getAll(): Promise<StandardMedicalCondition[]> {
        try {
            const medicalConditionRows = await this.db.select().from(standardMedicalConditions).all()
            return medicalConditionRows.map((row) => this.mapper.toDomain(row))
        } catch (error) {
            throw new StandardMedicalConditionError("Erreur lors de la récupération de toutes les conditons medicales.", error as Error, {})
        }
    }
    async delete(medicalConditonId: AggregateID): Promise<void> {
        try {
            await this.db.delete(standardMedicalConditions).where(eq(standardMedicalConditions.id, medicalConditonId as string))
        } catch (error) {
            throw new StandardMedicalConditionError("Erreur lors de la suppression du condition médicale.", error as Error, {
                medicalConditonId
            })
        }
    }
    private async checkIfExist(medicalConditionId: AggregateID): Promise<boolean> {
        const medCond = await this.db.select().from(standardMedicalConditions).where(eq(standardMedicalConditions.id, medicalConditionId as string))
        return !!medCond
    }

}