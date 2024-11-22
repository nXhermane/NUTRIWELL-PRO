import { HealthIndicator, IHealthIndicator, Mapper, NeedsRecommendation, NeedsRecommendationDto, NeedsRecommendationMapper } from "@/core/shared";
import { StandardMedicalCondition } from "../../domain/aggregate/StandardMedicalCondition";
import { StandardMedicalConditionDto } from "../dtos/StandardMedicalCondititonDto";
import { StandardMedicalConditionPersistenceType } from "../types";
import { NeedsRecommendationFactory } from "@/core/shared/modules/NeedsRecommendations/factories/NeedsRecommendationFactory";

export class StandardMedicalConditionMapper implements Mapper<StandardMedicalCondition, StandardMedicalConditionPersistenceType, StandardMedicalConditionDto> {
    toPersistence(entity: StandardMedicalCondition): StandardMedicalConditionPersistenceType {
        return {
            id: entity.id as string,
            name: entity.name,
            description: entity.description,
            criteria: entity.criteria,
            recommendations: entity.getRecommendations().map(recommendation => NeedsRecommendationMapper.toDto(recommendation)),
            healthIndicators: entity.healthIndicators,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
    toDomain(record: StandardMedicalConditionPersistenceType): StandardMedicalCondition {
        const recommendationsResult = record.recommendations.map((recommendation: NeedsRecommendationDto) => NeedsRecommendationFactory.create(recommendation))
        const healthIndicatorResult = record.healthIndicators.map((healthIndicator: IHealthIndicator) => HealthIndicator.create(healthIndicator))

        const standardMedicalCondition = new StandardMedicalCondition({
            id: record.id,
            props: {
                name: record.name,
                description: record.description,
                criteria: record.criteria,
                defaultRecommendation: recommendationsResult.map(recommendation => recommendation.val),
                healthIndicators: healthIndicatorResult.map(healthIndicator => healthIndicator.val)
            },
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        })
        return standardMedicalCondition
    }
    toResponse(entity: StandardMedicalCondition): StandardMedicalConditionDto {
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            criteria: entity.criteria,
            recommendations: entity.getRecommendations().map(recommendation=> NeedsRecommendationMapper.toDto(recommendation)),
            healthIndicators: entity.healthIndicators,
        }
    }


}