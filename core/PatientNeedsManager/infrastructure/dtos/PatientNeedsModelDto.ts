import { AggregateID, INutritionalSource } from "@/core/shared";
import { NutrientModelGroup } from "../../domain/services/NutritionalStandardNeedsCalculator";
import { CreateValidationRegularProps } from "../../domain/types";

export interface PatientNeedsModelDto {
   id: AggregateID;
   modelType: "specific"| "standard",
   protocolName: string
   protocolSource: INutritionalSource
   energyMetrics:NutrientModelGroup ;
   macronutrients: NutrientModelGroup;
   micronutrients: NutrientModelGroup;
   validationRules: CreateValidationRegularProps[]
   createdAt: string;
   updatedAt: string;
}
