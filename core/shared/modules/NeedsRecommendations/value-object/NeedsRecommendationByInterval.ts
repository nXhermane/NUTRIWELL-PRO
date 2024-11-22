import { nutritionFormulars } from "@/core/PatientNeedsManager/infrastructure/database/patientNeeds";
import { INeedsRecommendation, NeedsRecommendation, NeedsRecommendationContext, NutrientNeedsValue } from "./NeedsRecommendation";
import { Guard } from "@/core/shared/core";
import { InvalidArgumentFormatError } from "@/core/shared/exceptions";


export interface INeedsRecommendationByInterval {
    min: number | null
    max: number | null
    unit: string
}

export class NeedsRecommendationByInterval extends NeedsRecommendation<INeedsRecommendationByInterval> {
    constructor(props: INeedsRecommendation<INeedsRecommendationByInterval>) {
        super({
            ...props,
            type: "Interval"
        })
    }
    protected _apply(nutrientBasicValue: NutrientNeedsValue, context: NeedsRecommendationContext): NutrientNeedsValue {
        if (this.props.data.min != null) {
            const nutrientBaseValueIsLowerToMinValue = nutrientBasicValue.value < this.props.data.min
            if (nutrientBaseValueIsLowerToMinValue) return { value: this.props.data.min, unit: this.props.data.unit }
        }
        if (this.props.data.max != null) {
            const nutrientBaseValueIsSuperiorToMaxValue = nutrientBasicValue.value > this.props.data.max
            if (nutrientBaseValueIsSuperiorToMaxValue) return { value: this.props.data.max, unit: this.props.data.unit }
        }
        return nutrientBasicValue
    }

    protected validate(props: INeedsRecommendation<INeedsRecommendationByInterval>): void {
        super.validate(props)
        if (!Guard.isNumber(props.data.max).succeeded && !Guard.isNumber(props.data.min).succeeded) throw new InvalidArgumentFormatError("Pour la recommandation par intervalle, au moins une des bornes de l'intervalle doit être donnée.")
    }
    isMax(): boolean {
        return Guard.isNumber(this.props.data.max).succeeded
    }
    isMin(): boolean {
        return Guard.isNumber(this.props.data.min).succeeded
    }
    isInterval(): boolean {
        return this.isMax() && this.isMin()
    }

}
