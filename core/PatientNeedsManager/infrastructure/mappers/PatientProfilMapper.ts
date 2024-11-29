import { Mapper } from "@/core/shared";
import { PatientProfil } from "../../domain/aggregates/PatientProfil";
import { PatientProfilPersistence } from "../repositories";
import { PatientProfilDto } from "../dtos/PatientProfilDto";

export class PatientProfilMapper implements Mapper<PatientProfil, PatientProfilPersistence, PatientProfilDto> {
   toPersistence(entity: PatientProfil): PatientProfilPersistence {
      throw new Error("Method not implemented.");
   }
   toDomain(record: any): PatientProfil {
      throw new Error("Method not implemented.");
   }
   toResponse(entity: PatientProfil): PatientProfilDto {
      throw new Error("Method not implemented.");
   }
}
