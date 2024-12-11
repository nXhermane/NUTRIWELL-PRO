import { AggregateID, INutritionalSource } from "@/core/shared";
import { CreateValidationRegularProps } from "../../domain/types";
import { CreateNutrientDescriptorProps } from "../../domain/value-objects/types";

export interface PatientNeedsModelDto {
   id: AggregateID;
   modelType: "specific" | "standard",
   protocolName: string
   protocolSource: INutritionalSource
   energyMetrics: CreateNutrientDescriptorProps[];
   macronutrients: CreateNutrientDescriptorProps[];
   micronutrients: CreateNutrientDescriptorProps[];
   validationRules: CreateValidationRegularProps[]
   createdAt: string;
   updatedAt: string;
}
