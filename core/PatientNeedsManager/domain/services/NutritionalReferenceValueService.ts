import { Result } from "@/core/shared";
import { NutritionalReferenceValue, VariableObject, NutritionalRecommendedValue } from "../entities/NutritionalReferenceValue";
import { NutritionalRef } from "../value-objects/NutritionalRef";
import { INutritionalReferenceValueService } from "./interfaces/NutritionalReferenceValueService";
import SmartCalc from "smartcal";

export class NutritionalReferenceValueService implements INutritionalReferenceValueService {
   getNutritionalRecommendedValue(
      nutritionalReferenceValue: NutritionalReferenceValue,
      variableObject: VariableObject,
   ): Result<NutritionalRecommendedValue> {
      const adaptedResult = this.getNutritionalAdaptedValue(nutritionalReferenceValue, variableObject);
      if (adaptedResult.isFailure) return Result.fail<NutritionalRecommendedValue>("Aucune valeur trouvée dans les conditions.");
      const adaptedValue = adaptedResult.val.unpack();
      const nutritionalRefValue = adaptedValue?.anr || adaptedValue?.as || adaptedValue?.bme;
      return Result.ok<NutritionalRecommendedValue>({
         value: nutritionalRefValue as number,
         unit: nutritionalReferenceValue.unit,
         tagname: nutritionalReferenceValue.tagnames,
      });
   }
   getNutritionalAdaptedValue(nutritionalReferenceValue: NutritionalReferenceValue, variableObject: VariableObject): Result<NutritionalRef> {
      try {
         const nutritionalRefValueProps = nutritionalReferenceValue.getProps();
         const referenceValueWhoValidTheCondition: NutritionalRef[] = [];
         nutritionalRefValueProps.values.forEach((value: NutritionalRef) => {
            const condition = value.unpack().condition;
            const result = SmartCalc<typeof variableObject>(condition, variableObject);
            if (result === 0) referenceValueWhoValidTheCondition.push(value);
         });
         return Result.ok<NutritionalRef>(
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
