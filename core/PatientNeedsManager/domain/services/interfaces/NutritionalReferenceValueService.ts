import { Result } from "@/core/shared";
import { NutritionalRecommendedValue, NutritionalReferenceValue, VariableObject } from "../../entities/NutritionalReferenceValue";
import { NutritionalRef } from "../../value-objects/NutritionalRef";

export interface INutritionalReferenceValueService {
   getNutritionalRecommendedValue(
      nutritionalReferenceValue: NutritionalReferenceValue,
      variableObject: VariableObject,
   ): Result<NutritionalRecommendedValue>;
   getNutritionalAdaptedValue(nutritionalReferenceValue: NutritionalReferenceValue, variableObject: VariableObject): Result<NutritionalRef>;
}
