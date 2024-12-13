import { Mapper } from "@/core/shared";
import { PatientDataVariable } from "../../domain/entities/PatientDataVariable";
import { PatientDataVariableDto } from "../dtos/PatientDataVariableDto";
import { PatientDataVariablePersistence } from "../repositories";

export class PatientDataVariableMapper implements Mapper<PatientDataVariable, PatientDataVariablePersistence, PatientDataVariableDto> {
   toPersistence(entity: PatientDataVariable): PatientDataVariablePersistence {
      return {
         id: entity.id.toString(),
         patientProfilId: entity.patientProfilId.toString(),
         variables: entity.variables,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: PatientDataVariablePersistence): PatientDataVariable {
      return new PatientDataVariable({
         id: record.id,
         createdAt: record.createdAt,
         updatedAt: record.updatedAt,
         props: {
            patientProfilId: record.patientProfilId,
            variables: record.variables,
         },
      });
   }
   toResponse(entity: PatientDataVariable): PatientDataVariableDto {
      return {
         id: entity.id,
         patientProfilId: entity.patientProfilId,
         variables: entity.variables,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
}
