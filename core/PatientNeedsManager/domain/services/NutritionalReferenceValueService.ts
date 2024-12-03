import { EvaluateMathExpression, Result } from "@/core/shared";
import { NutritionalReferenceValue, VariableObject, NutritionalRecommendedValue } from "../entities/NutritionalReferenceValue";
import { NutritionalRef } from "../value-objects/NutritionalRef";
import { INutritionalReferenceValueService } from "./interfaces/NutritionalReferenceValueService";

export class NutritionalReferenceValueService implements INutritionalReferenceValueService {
   getNutritionalRecommendedValue(
      nutritionalReferenceValue: NutritionalReferenceValue,
      variableObject: VariableObject,
   ): Result<NutritionalRecommendedValue> {
      const adaptedResult = this.getNutritionalAdaptedValue(nutritionalReferenceValue, variableObject);
      if (adaptedResult.isFailure) return Result.fail<NutritionalRecommendedValue>("Aucune valeur trouvée dans les conditions.");
      const adaptedValue = adaptedResult.val.unpack();
      // Choix de la valeur a prendre en fonction des valeurs disponibles pour cette valeur de reference
      const nutritionalRefValue = adaptedValue?.anr || adaptedValue?.as || adaptedValue?.bme;
      return Result.ok<NutritionalRecommendedValue>({
         value: nutritionalRefValue as number,
         unit: nutritionalReferenceValue.unit,
         tagname: nutritionalReferenceValue.tagnames,
         source: nutritionalReferenceValue.source
      });
   }
   getNutritionalAdaptedValue(nutritionalReferenceValue: NutritionalReferenceValue, variableObject: VariableObject): Result<NutritionalRef> {
      try {
         const nutritionalRefValueProps = nutritionalReferenceValue.getProps();
         const referenceValueWhoValidTheCondition: NutritionalRef[] = [];
         // Selection des valeurs de reference valide pour ce patient en fonction de ces donéés
         nutritionalRefValueProps.values.forEach((value: NutritionalRef) => {
            const condition = value.unpack().condition;
            const result = EvaluateMathExpression.evaluate<typeof variableObject>(condition, variableObject);
            if (result === 0) referenceValueWhoValidTheCondition.push(value);
         });

         return Result.ok<NutritionalRef>(
            // Gestion du poids de la recommendation pour selectionner la valeur la plus appropriée
            referenceValueWhoValidTheCondition.reduce(
               (maxvalue: NutritionalRef, currentValue: NutritionalRef) =>
                  maxvalue.unpack().weight > currentValue.unpack().weight ? maxvalue : currentValue,
               referenceValueWhoValidTheCondition[0],
            ),
         );
      } catch (error: any) {
         return Result.fail<NutritionalRef>("Erreur lors de la résolution de la valeur nutritive: " + error.message);
      }
   }
}
