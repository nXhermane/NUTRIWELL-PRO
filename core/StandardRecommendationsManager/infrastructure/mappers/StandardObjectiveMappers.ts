import { Mapper, NeedsRecommendationFactory, NeedsRecommendationMapper, ObjectiveType, Timeframe } from "@/core/shared";
import { StandardObjective } from "../../domain/aggregate/StandardObjective";
import { StandardObjectivePersistenceType } from "../types";
import { StandardObjectiveDto } from "../dtos/StandardObjectiveDto";

export class StandardObjectiveMapper implements Mapper<StandardObjective, StandardObjectivePersistenceType, StandardObjectiveDto> {
    toPersistence(entity: StandardObjective): StandardObjectivePersistenceType {
        return {
            id: entity.id as string,
            name: entity.name,
            description: entity.description,
            type: entity.type as "General" | "Measure",
            timeframe: entity.timeframe,
            measureCode: entity.measureCode,
            unit: entity.unit,
            initialValue: entity.initialValue,
            targetValue: entity.targetValue,
            recommendations: entity.getRecommendations().map(recommendation => NeedsRecommendationMapper.toDto(recommendation)),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        }
    }
    toDomain(record: StandardObjectivePersistenceType): StandardObjective {
        const timeframeResult = Timeframe.create(record.timeframe)
        const standardObjective = new StandardObjective({
            id: record.id,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            props: {
                name: record.name,
                type: record.type as ObjectiveType,
                description: record.description,
                measureCode: record.measureCode,
                unit: record.unit,
                initialValue: record.initialValue,
                targetValue: record.targetValue,
                timeframe: timeframeResult.val,
                defaultRecommendation: record.recommendations.map(recommendation => NeedsRecommendationFactory.create(recommendation).val)
            }
        })
        return standardObjective
    }
    toResponse(entity: StandardObjective): StandardObjectiveDto {
        return {
            id: entity.id,
            name: entity.name,
            type: entity.type,
            description: entity.description,
            measureCode: entity.measureCode,
            unit: entity.unit,
            initialValue: entity.initialValue,
            targetValue: entity.targetValue,
            timeframe: entity.timeframe,
            recommendations: entity.getRecommendations().map(recommendation => NeedsRecommendationMapper.toDto(recommendation)),
        }
    }

}