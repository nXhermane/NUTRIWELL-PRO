import { RecommendationPriority } from "../RecommendationPriority";

export type NeedsRecommendationDto = {
    priority: RecommendationPriority;
    nutrientTagName: string;
    desciption: string;
    data: any;
    startDate?: string
    endDate?: string;
    condition?: {
        expression: string;
        variableTable: { [variableAlias: string]: string }
    }
    type: "Formular" | "Exclusion" | "Interval" | "Substitution" | "Relativity"
}
