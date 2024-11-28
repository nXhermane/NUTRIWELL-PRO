import { Mapper } from "@/core/shared";
import { PatientDataVariable } from "../../domain/aggregates/PatientDataVariable";
import { PatientDataVariableDto } from "../dtos/PatientDataVariableDto";
import { PatientDataVariablePersistence } from "../repositories";

export class PatientDataVariableMapper implements Mapper<PatientDataVariable, PatientDataVariablePersistence, PatientDataVariableDto> {
    toPersistence(entity: PatientDataVariable): PatientDataVariablePersistence {
        return {
            id: entity.id.toString(),
            patientId: entity.patientId.toString(),
            variables: entity.variables,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        }
    }
    toDomain(record: PatientDataVariablePersistence): PatientDataVariable {
        return new PatientDataVariable({
            id: record.id,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            props: {
                patientId: record.patientId,
                variables: record.variables,
            }
        })
    }
    toResponse(entity: PatientDataVariable): PatientDataVariableDto {
        return {
            id: entity.id,
            patientId: entity.patientId,
            variables: entity.variables,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        }
    }
}