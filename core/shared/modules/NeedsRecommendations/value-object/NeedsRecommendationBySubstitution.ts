import { INeedsRecommendation, NeedsRecommendation, NeedsRecommendationContext, NutrientNeedsValue } from "./NeedsRecommendation"

export interface INeedsRecommendationBySubstitution {
    value: number
    unit: string
}
export class NeedsRecommendationBySubstitution extends NeedsRecommendation<INeedsRecommendationBySubstitution> {

    constructor(props: INeedsRecommendation<INeedsRecommendationBySubstitution>) {
        super({
            ...props,
            type: "Substitution"
        })
    }
    protected _apply(nutrientBasicValue: NutrientNeedsValue, context: NeedsRecommendationContext): NutrientNeedsValue {
        return this.props.data
    }

}