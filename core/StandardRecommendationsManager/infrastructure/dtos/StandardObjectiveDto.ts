import { AggregateID, ITimeframe, NeedsRecommendationDto } from "@/core/shared";


export interface StandardObjectiveDto {
    id: AggregateID;
    name: string;
    type: "General"| "Measure"
    recommendations: NeedsRecommendationDto[]
    timeframe: ITimeframe;
    measureCode?: string;
    initialValue?: number // Valeur initiale standard
    targetValue?: number // Valeur a atteindre standard
    unit?: string;
    description: string;
}