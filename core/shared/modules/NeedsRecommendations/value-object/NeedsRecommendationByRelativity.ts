import { INeedsRecommendation, NeedsRecommendation, NeedsRecommendationContext, NutrientNeedsValue } from "./NeedsRecommendation";

export interface INeedsRecommendationByRelativity {
   percentage: number;
}
export class NeedsRecommendationByRelativity extends NeedsRecommendation<INeedsRecommendationByRelativity> {
   constructor(props: INeedsRecommendation<INeedsRecommendationByRelativity>) {
      super({
         ...props,
         type: "Relativity",
      });
   }
   protected _apply(nutrientBasicValue: NutrientNeedsValue, conext: NeedsRecommendationContext): NutrientNeedsValue {
      const value = nutrientBasicValue.value * this.props.data.percentage;
      return {
         tagname: this.props.nutrientTagName,
         value,
         unit: nutrientBasicValue.unit,
      };
   }
}
