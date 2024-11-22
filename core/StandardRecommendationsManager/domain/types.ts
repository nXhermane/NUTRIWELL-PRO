import { IHealthIndicator, ITimeframe, NeedsRecommendation } from "@/core/shared";

export type StandardMedicalConditionCriteriaType = {
    expression: string;
    variableMappingTable: { [variableName: string]: string };
}
export type CreateStandardObjectiveProps = {
    name: string;
    type: "Measure" | "General"
    defaultRecommendation: NeedsRecommendation[]
    timeframe: ITimeframe;
    measureCode?: string;
    initialValue?: number
    targetValue?: number
    unit?: string;
    description: string;
}
export type CreateStandardMedicalConditionProps = {
    name: string;
    description: string;
    criteria: StandardMedicalConditionCriteriaType;
    defaultRecommendation: NeedsRecommendation[];
    healthIndicators: IHealthIndicator[]
}