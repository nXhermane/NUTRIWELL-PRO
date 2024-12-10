import { AggregateID, INutritionalSource, ITimeframe, ModelType, NeedsRecommendation } from "@/core/shared";
import { NutrientNeedsValue } from "./PatientNeeds";
import { CreateFormularExpression, CreateNutritionalRef } from "../value-objects/types";
import { CreateValidationRegularProps } from "../types";
import { INutrientDescriptor } from "../value-objects/NutrientDescriptor";

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
   name: string
   source: INutritionalSource;
   conditionVariables: VariableMappingTable;
   formularExpressions: CreateFormularExpression[];
   unit: string
}


export type CreatePatientNeedsModel = {
   modelType: ModelType
   protocolSource?: INutritionalSource
   macronutrients: { [nutrientTagname: string]: INutrientDescriptor }
   micronutrients: { [nutrientTagname: string]: INutrientDescriptor }
   energyMetrics: { [nutrientTagname: string]: INutrientDescriptor }
   validationRules: CreateValidationRegularProps[]
   isValidModel: boolean
}