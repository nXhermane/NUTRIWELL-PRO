import { Result } from "@/core/shared";
import { VariableObject } from "../entities/NutritionalReferenceValue";
import { NutritionFormular, NutritionFormularResult } from "../entities/NutritionFormular";
import { INutritionFormularService } from "./interfaces/NutritionFormularService";
import SmartCalc from "smartcal";

export class NutritionFormularService implements INutritionFormularService {
   resolveFormular(nutritionFormular: NutritionFormular, variableObject: VariableObject): Result<NutritionFormularResult> {
      try {
         const expressionResult = SmartCalc<typeof variableObject>(nutritionFormular.expression, variableObject);
         return Result.ok<NutritionFormularResult>({ value: expressionResult as number | string, name: nutritionFormular.name });
      } catch (error: any) {
         return Result.fail<NutritionFormularResult>(`Erreur lors de la résolution de la formule: ${error.message}`);
      }
   }
}
