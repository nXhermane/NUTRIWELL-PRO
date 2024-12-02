import { AggregateID, ITimeframe, NeedsRecommendation } from "@/core/shared";
import { NutrientNeedsValue } from "./PatientNeeds";

// Mapping Table : Variable Alias : Variable Name or variable value
export type VariableMappingTable = {
   [variableName: string]: any;
};

export type CreatePatientNeedsProps = {
   patientProfilId: AggregateID;
   energy: { [energyType: string]: NutrientNeedsValue };
   micronutrients: { [micronutrientName: string]: NutrientNeedsValue };
   macronutrients: { [macronutrientName: string]: NutrientNeedsValue };
};

export type CreateObjectiveProps = {
   standardObjectiveId?: AggregateID;
   name: string;
   type: "Measure" | "General";
   status: "InProgress" | "NotAchieved" | "Achieved";
   recommendations: NeedsRecommendation[];
   timeframe: ITimeframe;
   measureCode?: string;
   initialValue?: number;
   targetValue?: number;
   unit?: string;
   description: string;
};
