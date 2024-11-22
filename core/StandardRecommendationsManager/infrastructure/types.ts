import { IHealthIndicator, ITimeframe, NeedsRecommendationDto } from "@/core/shared";
import { RecommendationPriority } from "@/core/shared/modules/NeedsRecommendations/RecommendationPriority";
export interface Timestamps {
    createdAt: string;
    updatedAt: string;
}


export type ExpressionPersistenceType = {
    expression: string;
    variableMappingTable: { [variableName: string]: string };
}

export interface StandardMedicalConditionPersistenceType extends Timestamps {
    id: string
    name: string;
    description: string;
    criteria: ExpressionPersistenceType;
    recommendations: NeedsRecommendationDto[];
    healthIndicators: IHealthIndicator[]
}
export interface StandardObjectivePersistenceType extends Timestamps {
    id: string;
    name: string;
    type: "General" | "Measure"
    recommendations: NeedsRecommendationDto[]
    timeframe: ITimeframe;
    measureCode?: string;
    initialValue?: number // Valeur initiale standard
    targetValue?: number // Valeur a atteindre standard
    unit?: string;
    description: string;
} 