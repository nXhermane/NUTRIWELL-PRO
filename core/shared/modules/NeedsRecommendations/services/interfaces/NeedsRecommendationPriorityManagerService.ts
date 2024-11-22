import { NeedsRecommendation, NeedsRecommendationContext, NutrientNeedsValue } from "../../value-object/NeedsRecommendation";

export interface INeedsRecommendationPriorityManagerService {
    resolve(nutirentBasicValue: NutrientNeedsValue,context: NeedsRecommendationContext, recommendations: NeedsRecommendation<any>[]): NutrientNeedsValue
}