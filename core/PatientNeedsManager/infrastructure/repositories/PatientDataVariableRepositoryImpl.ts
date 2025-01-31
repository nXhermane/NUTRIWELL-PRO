import { AggregateDomainEvent, AggregateID, Mapper } from "@/core/shared";
import { PatientDataVariable } from "../../domain/entities/PatientDataVariable";
import { PatientDataVariableRepository } from "./interfaces/PatientDataVariableRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { PatientDataVariablePersistence } from "./types";
import { PatientDataVariableDto } from "../dtos/PatientDataVariableDto";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { patientDataVariables } from "../database/patientNeeds";
import { eq, or } from "drizzle-orm";
import { PatientDataVariableRepositoryError, PatientDataVariableRepositoryNotFoundException } from "./errors/PatientDataVariableRepositoryErrors";

export class PatientDataVariableRepositoryImpl implements PatientDataVariableRepository {
   private db;
   constructor(
      expo: SQLiteDatabase,
      private mapper: Mapper<PatientDataVariable, PatientDataVariablePersistence, PatientDataVariableDto>,
   ) {
      this.db = drizzle(expo);
   }
   async save(patientDataVariable: PatientDataVariable): Promise<void> {
      try {
         const patientDataVariablePersistence = this.mapper.toPersistence(patientDataVariable);
         const exist = await this.checkIfExist(patientDataVariablePersistence.id);
         if (!exist) await this.db.insert(patientDataVariables).values(patientDataVariablePersistence);
         else
            await this.db
               .update(patientDataVariables)
               .set(patientDataVariablePersistence)
               .where(eq(patientDataVariables.id, patientDataVariablePersistence.id));
         AggregateDomainEvent.get().dispatchEventsForMarkedAggregate(patientDataVariable.id);
      } catch (error) {
         throw new PatientDataVariableRepositoryError("Erreur lors du sauvegarde de patientDataVariable", error as Error, { patientDataVariable });
      }
   }
   async getById(patientDataVariableOrPatientProfilId: AggregateID): Promise<PatientDataVariable> {
      try {
         const patientDataVariableRow = await this.db
            .select()
            .from(patientDataVariables)
            .where(
               or(
                  eq(patientDataVariables.id, patientDataVariableOrPatientProfilId as string),
                  eq(patientDataVariables.patientProfilId, patientDataVariableOrPatientProfilId as string),
               ),
            )
            .get();
         if (!patientDataVariableRow)
            throw new PatientDataVariableRepositoryNotFoundException("Le patient Data variable n'est pas trouvé.", new Error(), {
               patientDataVariableOrPatientProfilId,
            });
         return this.mapper.toDomain(patientDataVariableRow);
      } catch (error) {
         throw new PatientDataVariableRepositoryError("Erreur lors de la récuperation du patient Data Variable", error as Error, {
            patientDataVariableOrPatientProfilId,
         });
      }
   }
   async delete(patientDataVariableOrPatientProfilId: AggregateID): Promise<void> {
      try {
         await this.db
            .delete(patientDataVariables)
            .where(
               or(
                  eq(patientDataVariables.id, patientDataVariableOrPatientProfilId as string),
                  eq(patientDataVariables.patientProfilId, patientDataVariableOrPatientProfilId as string),
               ),
            );
            AggregateDomainEvent.get().dispatchEventsForMarkedAggregate(patientDataVariableOrPatientProfilId)
      } catch (error) {
         throw new PatientDataVariableRepositoryError("Erreur lors de la suppression du patient Data Variables.", error as Error, {
            patientDataVariableOrPatientProfilId,
         });
      }
   }
   private async checkIfExist(patientDataVariableId: AggregateID): Promise<boolean> {
      const patientDataVariable = await this.db
         .select()
         .from(patientDataVariables)
         .where(eq(patientDataVariables, patientDataVariableId as string))
         .get();
      return !!patientDataVariable;
   }
}
