import { Mapper, NeedsRecommendationFactory, NeedsRecommendationMapper, ObjectiveStatus, ObjectiveType, Timeframe } from "@/core/shared";
import { ObjectivePersistence } from "../repositories";
import { ObjectiveDto } from "../dtos/ObjectiveDto";
import { Objective } from "../../domain/entities/Objective";

export class ObjectiveMapper implements Mapper<Objective, ObjectivePersistence, ObjectiveDto> {
   toPersistence(entity: Objective): ObjectivePersistence {
      return {
         id: entity.id as string,
         name: entity.name,
         description: entity.description,
         timeframe: entity.timeframe,
         type: entity.type,
         status: entity.status,
         unit: entity.unit,
         measureCode: entity.measureCode,
         initialValue: entity.initialValue,
         targetValue: entity.targetValue,
         currentValue: entity.currentValue,
         standardObjectiveId: entity.standardObjectiveId as string,
         recommendations: entity.getRecommendation().map((val) => NeedsRecommendationMapper.toDto(val)),
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: ObjectivePersistence): Objective {
      return new Objective({
         id: record.id,
         createdAt: record.createdAt,
         updatedAt: record.updatedAt,
         props: {
            name: record.name,
            type: record.type as ObjectiveType,
            status: record.status as ObjectiveStatus,
            standardObjectiveId: record.standardObjectiveId,
            unit: record.unit,
            measureCode: record.measureCode,
            initialValue: record.initialValue,
            targetValue: record.targetValue,
            currentValue: record.currentValue,
            description: record.description,
            timeframe: Timeframe.create(record.timeframe).val,
            recommendations: record.recommendations.map((recommendation) => NeedsRecommendationFactory.create(recommendation).val),
         },
      });
   }
   toResponse(entity: Objective): ObjectiveDto {
      return this.toPersistence(entity);
   }
}
