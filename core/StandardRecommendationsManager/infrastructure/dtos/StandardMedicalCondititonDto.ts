import { AggregateID, IHealthIndicator, NeedsRecommendationDto } from "@/core/shared";
import { ExpressionPersistenceType,  } from "../types";

export interface StandardMedicalConditionDto {
    id: AggregateID
    name: string;
    description: string;
    criteria: ExpressionPersistenceType;
    recommendations: NeedsRecommendationDto[];
    healthIndicators: IHealthIndicator[]
}