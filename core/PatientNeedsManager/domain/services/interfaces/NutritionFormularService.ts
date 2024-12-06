import { AggregateID, Result } from "@/core/shared";
import { VariableObject } from "../../entities/NutritionalReferenceValue";
import { NutritionFormular, NutritionFormularResult } from "../../entities/NutritionFormular";

export interface INutritionFormularService {
   resolveFormular(
      nutritionFormular: NutritionFormular,
      variableObject: VariableObject,
      patientProfilId: AggregateID,
   ): Promise<Result<NutritionFormularResult>>;
}
