import { Gender, Mapper, PhysicalActivityLevel } from "@/core/shared";
import { PatientProfil } from "../../domain/aggregates/PatientProfil";
import { HealthMetricPersistence, PatientProfilPersistence, PatientProfilPersistenceRecord } from "../repositories";
import { PatientProfilDto } from "../dtos/PatientProfilDto";
import { HealthMetric } from "../../domain/value-objects/HealthMetric";
import { Height } from "../../domain/value-objects/Height";
import { Weight } from "../../domain/value-objects/Weight";
import { Age } from "../../domain/value-objects/Age";

export class PatientProfilMapper implements Mapper<PatientProfil, PatientProfilPersistence, PatientProfilDto> {
   toPersistence(entity: PatientProfil): PatientProfilPersistence {
      return {
         id: entity.id as string,
         patientId: entity.patientId as string,
         patientNeedsModelId: entity.patientNeedsModelId as string,
         physicalActivityLevel: entity.physicalActivityLevel,
         healthMetrics: Object.values(entity.healthMetrics).map((val) => ({
            unit: val.unit.toString(),
            code: val.code.toString(),
            value: val.value,
         })),
         height: entity.height,
         age: entity.age,
         weight: entity.weight,
         gender: entity.gender,
         medicalConditionIds: entity.getMedicalConditions().map((medicalCondition) => medicalCondition.id),
         objectiveIds: entity.getObjectives().map((objective) => objective.id),
         otherInformations: entity.otherInformations,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: PatientProfilPersistenceRecord): PatientProfil {
      return new PatientProfil({
         id: record.id,
         createdAt: record.createdAt,
         updatedAt: record.updatedAt,
         props: {
            patientId: record.patientId,
            patientNeedsModelId: record.patientNeedsModelId,
            physicalActivityLevel: record.physicalActivityLevel as PhysicalActivityLevel,
            healthMetrics: this.createHealthMetrics(record.healthMetrics),
            height: Height.create(record.height).val,
            weight: Weight.create(record.weight).val,
            age: Age.create(record.age).val,
            gender: Gender.create(record.gender).val,
            objectives: Object.fromEntries(record.objectives.map((objective) => [objective.id, objective])),
            medicalConditions: Object.fromEntries(record.medicalConditions.map((medicalCondition) => [medicalCondition.id, medicalCondition])),
            otherInformations: record.otherInformations,
         },
      });
   }
   toResponse(entity: PatientProfil): PatientProfilDto {
      return this.toPersistence(entity);
   }
   private createHealthMetrics(record: HealthMetricPersistence[]): { [code: string]: HealthMetric } {
      return Object.fromEntries(
         record.map((val) => {
            const healthMetrics = HealthMetric.create(val).val;
            return [healthMetrics.unpack().code, healthMetrics];
         }),
      );
   }
}
