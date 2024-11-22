import SmartCalc from "smartcal";
import { INeedsRecommendation, NeedsRecommendation, NeedsRecommendationContext, NutrientNeedsValue } from "./NeedsRecommendation";
import { Guard } from "@/core/shared/core";
import { InvalidResultError } from "@/core/shared/exceptions";

export interface INeedsRecommendationByFormular {
    formular: string
    variables: { [variableAliasName: string]: string } // Table associant les variables avec les alias 
    unit: string
}
export class NeedsRecommendationByFormular extends NeedsRecommendation<INeedsRecommendationByFormular> {
    constructor(props: INeedsRecommendation<INeedsRecommendationByFormular>) {
        super({
          ...props,
          type: "Formular",
        })
      }
    getVariableTable(): { [key: string]: string | number; } {
        const conditionVariableTable = super.getVariableTable()
        const formularVariableTable = this.props.data.variables
        return { ...conditionVariableTable, ...formularVariableTable }
    }
    protected _apply(nutrientBasicValue: NutrientNeedsValue, context: NeedsRecommendationContext): NutrientNeedsValue {
        const formularEvaluationResult = SmartCalc<NeedsRecommendationContext>(this.props.data.formular, context)
        if (!Guard.isNumber(formularEvaluationResult).succeeded) throw new InvalidResultError("La formule de la recommandation renvoie un resultat incorrecte.")
        return {
            value: formularEvaluationResult as number,
            unit: this.props.data.unit // TODO: En principe je devrais coder un convertisseur d'unité pour garantir la coherence . 
        }
    }
}