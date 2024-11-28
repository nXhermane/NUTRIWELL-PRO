import { AggregateID, DomainEvents, Mapper } from "@/core/shared";
import { PatientDataVariable } from "../../domain/aggregates/PatientDataVariable";
import { PatientDataVariableRepository } from "./interfaces/PatientDataVariableRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { PatientDataVariablePersistence } from "./types";
import { Patient } from "@/core/PatientManager";
import { PatientDataVariableDto } from "../dtos/PatientDataVariableDto";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { patientDataVariables } from "../database/patientNeeds";
import { eq } from "drizzle-orm";
import { PatientDataVariableRepositoryError, PatientDataVariableRepositoryNotFoundException } from "./errors/PatientDataVariableRepositoryErrors";

export class PatientDataVariableRepositoryImpl implements PatientDataVariableRepository {
    private db
    constructor(expo: SQLiteDatabase, private mapper: Mapper<PatientDataVariable, PatientDataVariablePersistence, PatientDataVariableDto>) {
        this.db = drizzle(expo)
    }
    async save(patientDataVariable: PatientDataVariable): Promise<void> {
        try {
            const patientDataVariablePersistence = this.mapper.toPersistence(patientDataVariable)
            const exist = await this.checkIfExist(patientDataVariablePersistence.id);
            if (!exist) await this.db.insert(patientDataVariables).values(patientDataVariablePersistence)
            else await this.db.update(patientDataVariables).set(patientDataVariablePersistence).where(eq(patientDataVariables.id, patientDataVariablePersistence.id))
            DomainEvents.dispatchEventsForAggregate(patientDataVariable.id)
        } catch (error) {
            throw new PatientDataVariableRepositoryError("Erreur lors du sauvegarde de patientDataVariable", error as Error, { patientDataVariable })
        }
    }
    async getById(patientDataVariableId: AggregateID): Promise<PatientDataVariable> {
        try {
            const patientDataVariableRow = await this.db.select().from(patientDataVariables).where(eq(patientDataVariables.id, patientDataVariableId as string)).get()
            if (!patientDataVariableRow) throw new PatientDataVariableRepositoryNotFoundException("Le patient Data variable n'est pas trouvé.", new Error(), { patientDataVariableId })
            return this.mapper.toDomain(patientDataVariableRow)
        } catch (error) {
            throw new PatientDataVariableRepositoryError("Erreur lors de la récuperation du patient Data Variable", error as Error, { patientDataVariableId })
        }
    }
    async delete(patientDataVariableId: AggregateID): Promise<void> {
        try {
            await this.db.delete(patientDataVariables).where(eq(patientDataVariables.id, patientDataVariableId as string))
        } catch (error) {
            throw new PatientDataVariableRepositoryError("Erreur lors de la suppression du patient Data Variables.", error as Error, { patientDataVariableId })
        }
    }
    private async checkIfExist(patientDataVariableId: AggregateID): Promise<boolean> {
        const patientDataVariable = await this.db.select()
            .from(patientDataVariables)
            .where(eq(patientDataVariables, patientDataVariableId as string))
            .get();
        return !!patientDataVariable;
    }

}