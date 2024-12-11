import { HealthIndicator, Mapper, MedicalConditionSeverity, NeedsRecommendation, NeedsRecommendationFactory, NeedsRecommendationMapper } from "@/core/shared";
import { MedicalCondition } from "../../domain/entities/MedicalCondition";
import { MedicalConditionPersistence } from "../repositories";
import { MedicalConditionDto } from "../dtos/MedicalConditionDto";

export class MedicalConditionMapper implements Mapper<MedicalCondition, MedicalConditionPersistence, MedicalConditionDto> {
    toPersistence(entity: MedicalCondition): MedicalConditionPersistence {
        return {
            id: entity.id as string,
            name: entity.name,
            standardMedicalConditionId: entity.standardMedicalConditionId as string,
            severity: entity.severity,
            recommendations: entity.recommandation.map(val => NeedsRecommendationMapper.toDto(val)),
            healthIndicators: entity.healthIndicators.map(healthIndicator => healthIndicator.unpack()),
            description: entity.desciption,
            otherInformation: entity.otherInformation,
            createdAt: entity.createdAt, updatedAt: entity.updatedAt
        }
    }
    toDomain(record: MedicalConditionPersistence): MedicalCondition {
        return new MedicalCondition({
            id: record.id,
            updatedAt: record.updatedAt,
            createdAt: record.createdAt,
            props: {
                name: record.name,
                standardMedicalConditionId: record.standardMedicalConditionId,
                severity: record.severity as MedicalConditionSeverity,
                description: record.description,
                otherInformation: record.otherInformation,
                recommendations: record.recommendations.map(val => NeedsRecommendationFactory.create(val).val),
                healthIndicators: record.healthIndicators.map(val => HealthIndicator.create(val).val)
            }
        })
    }
    toResponse(entity: MedicalCondition): MedicalConditionDto {
      return this.toPersistence(entity) 
    }

}