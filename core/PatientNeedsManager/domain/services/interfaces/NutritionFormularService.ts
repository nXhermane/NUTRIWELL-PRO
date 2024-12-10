import { AggregateID, Result } from "@/core/shared";
import { VariableObject } from "../../entities/NutritionalReferenceValue";
import { NutritionFormular, NutritionFormularResult } from "../../entities/NutritionFormular";
import { PatientProfil } from "../../aggregates/PatientProfil";

export interface INutritionFormularService {
   resolveFormular(
      nutritionFormular: NutritionFormular,
      variableObject: VariableObject,
      patientProfil: PatientProfil,
   ): Promise<Result<NutritionFormularResult>>;
}
