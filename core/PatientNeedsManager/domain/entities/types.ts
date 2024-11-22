import { AggregateID } from "@/core/shared";
import { NutrientNeedsValue } from "./PatientNeeds";

// Mapping Table : Variable Alias : PathOrValue of Variable
export type VariableMappingTable = {
   [variableName: string]: string;
};

export type CreatePatientNeedsProps = {
   patientId: AggregateID;
   energy: { [energyType: string]: NutrientNeedsValue };
   micronutrients: { [micronutrientName: string]: NutrientNeedsValue };
   macronutrients: { [macronutrientName: string]: NutrientNeedsValue };
};
