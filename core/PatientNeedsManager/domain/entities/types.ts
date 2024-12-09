import { AggregateID, INutritionalSource, ITimeframe, NeedsRecommendation } from "@/core/shared";
import { NutrientNeedsValue } from "./PatientNeeds";
import { INutritionalRef } from "../value-objects/NutritionalRef";
import { CreateFormularExpression, CreateNutritionalRef } from "../value-objects/types";
import { IFormularExpression } from "../value-objects/FormularExpression";

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
export type CreateNutritionalReferenceValueProps = {
   tagnames: string;
   source: INutritionalSource;
   unit: string;
   values: CreateNutritionalRef[];
   variables: VariableMappingTable;
}
export type CreateNutritionFormulaProps = {
   name : string
   source: INutritionalSource;
   conditionVariables: VariableMappingTable;
   formularExpressions: CreateFormularExpression[];
   unit: string
}
