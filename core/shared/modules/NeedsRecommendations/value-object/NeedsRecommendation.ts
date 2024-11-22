import { CDate, ValueObject } from "@/core/shared/domain";
import { RecommendationPriority } from "../RecommendationPriority";
import { Guard } from "@/core/shared/core";
import { ArgumentOutOfRangeException, EmptyStringError, InvalidReference } from "@/core/shared/exceptions";
import SmartCalc from "smartcal";

type Condition = {
   expression: string;
   variableTable: { [variableAlias: string]: string }
}
export interface INeedsRecommendation<T> {
   priority: RecommendationPriority;
   nutrientTagName: string;
   desciption: string;
   /**
    * contient les données  propre à chaque Type de recommandations 
    */
   data: T;
   startDate?: CDate
   endDate?: CDate;
   /**
    * this condition is optional , je l'ai implementé afin d'éviter la creation d'une autre type de recommendation 
    */
   condition?: Condition;
   type: "Formular"|"Exclusion"| "Interval"| "Substitution"| "Relativity"

}
export type NutrientNeedsValue = { value: number; unit: string };
export type NeedsRecommendationContext = { [variableName: string]: any } & { currentDate: CDate }
export abstract class NeedsRecommendation<T = any> extends ValueObject<INeedsRecommendation<T>> {
   /**
    * Il fait la composition des tables de mappages des variables utilisées dans la recommandation 
    * @returns - Object {[variableAlias: string]: variableName|| variableValue} 
    */
   getVariableTable(): { [key: string]: string | number } {
      return this.props?.condition?.variableTable || {}
   }
   /**
    * Applique la recommandation au valeur nutritionnel standard qui est prise en parametres 
    * @param nutrientBasicValue valeur nutritionnel standard calculer a partie du patientNeedsModel  
    * @param context le context est l'Objet composé a partie tables de mappages des variables . Il contient chaque alias associée a sa valeur 
    * @returns NutrientNeedsValue Object 
    */
   apply(nutrientBasicValue: NutrientNeedsValue, context: NeedsRecommendationContext): NutrientNeedsValue {
      if (this.props.condition) {
         const expressionEvaluationResult = SmartCalc(this.props.condition.expression, context)
         if (expressionEvaluationResult != 0) return nutrientBasicValue
      }
      if (this.props.startDate && this.props.endDate) {
         const currentDate = context.currentDate
         if (currentDate.isAfter(this.props.startDate) || currentDate.isBefore(this.props.endDate)) return nutrientBasicValue
      }
      return this._apply(nutrientBasicValue, context)
   }
   protected abstract _apply(nutrientBasicValue: NutrientNeedsValue, context: NeedsRecommendationContext): NutrientNeedsValue;

   protected validate(props: INeedsRecommendation<T>): void {
      if (Guard.isEmpty(props.nutrientTagName).succeeded) throw new EmptyStringError("Le Nutriment que vous recommender doit etre indiquer.");
      if (!Object.values(RecommendationPriority).includes(props.priority))
         throw new InvalidReference("La priorité que vous donnez a cette recommendation n'est pas prise en charge pas ce systeme.");
      if (!Guard.isEmpty(props.startDate).succeeded && !Guard.isEmpty(props.endDate).succeeded) {
         if (!props.startDate?.isBefore(props.endDate as CDate)) throw new ArgumentOutOfRangeException("La date de début d'application de la recommandation doit être avant la date de fin. ")
      }
   }

   
}
