import { NeedsRecommendation, NeedsRecommendationContext, NutrientNeedsValue } from "../value-object/NeedsRecommendation";
import { INeedsRecommendationPriorityManagerService } from "./interfaces/NeedsRecommendationPriorityManagerService";
/**
 * Pour le moment , je vais opter pour l'application recommandation par priorité inversé 
 * TODO : Après je dois le refaire afin d'obtenir le resultat optimiser que je veux  
 */
export class NeedsRecommendationPriorityManagerService implements INeedsRecommendationPriorityManagerService {

    private sortRecommendationByPriority(recommendations: NeedsRecommendation<any>[]): NeedsRecommendation<any>[] {
        return recommendations.sort((a, b) => a.unpack().priority - b.unpack().priority);
    }
    resolve(nutirentBasicValue: NutrientNeedsValue, context: NeedsRecommendationContext, recommendations: NeedsRecommendation<any>[]): NutrientNeedsValue {
        const sortedRecommendations = this.sortRecommendationByPriority(recommendations)
        let nutrientAjustedValue = nutirentBasicValue
        for (let i = sortedRecommendations.length - 1; i < 0; i--) {
            const currentRecommendation = sortedRecommendations[i]
            nutrientAjustedValue = currentRecommendation.apply(nutrientAjustedValue, context)
        }
        return nutrientAjustedValue
    }

}