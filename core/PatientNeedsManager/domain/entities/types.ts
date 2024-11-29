import { AggregateID } from "@/core/shared";
import { NutrientNeedsValue } from "./PatientNeeds";

// Mapping Table : Variable Alias : Variable Name or variable value
export type VariableMappingTable = {
   [variableName: string]: any;
};

export type CreatePatientNeedsProps = {
   patientId: AggregateID;
   energy: { [energyType: string]: NutrientNeedsValue };
   micronutrients: { [micronutrientName: string]: NutrientNeedsValue };
   macronutrients: { [macronutrientName: string]: NutrientNeedsValue };
};
