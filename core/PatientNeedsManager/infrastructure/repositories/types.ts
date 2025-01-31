import { AggregateID, IHealthIndicator, INutritionalSource, ITimeframe, NeedsRecommendationDto } from "@/core/shared";
import { CreateFormularExpression, CreateHealthMetricProps, CreateNutrientDescriptorProps } from "../../domain/value-objects/types";
import { CreateValidationRegularProps } from "../../domain/types";
import { MedicalCondition } from "../../domain/entities/MedicalCondition";
import { Objective } from "../../domain/entities/Objective";

export type HealthMetricPersistence = CreateHealthMetricProps;
export type HealthIndicatorsPersistence = IHealthIndicator;
export type FormularExpressionPersistence = CreateFormularExpression;
export interface Timestamp {
   createdAt: string;
   updatedAt: string;
}

export interface NutritionalReferenceValuePersistence extends Timestamp {
   id: AggregateID;
   tagname: string;
   source: INutritionalSource;
   unit: string;
   values: NutritionalRefPersistence[];
   conditionVariables: VariablesPersistence;
   systemVariableName: string;
}
export interface NutritionFormularPersistence extends Timestamp {
   id: AggregateID;
   name: string;
   source: INutritionalSource;
   conditionVariables: VariablesPersistence;
   formularExpressions: FormularExpressionPersistence[];
   unit: string;
   systemVariableName: string;
}
export interface NutritionalRefPersistence {
   condition: string;
   weight: number;
   bme?: number;
   anr?: number;
   amt?: number;
   as?: number;
}

type VariablesPersistence = { [key: string]: string };
export interface PatientDataVariablePersistence extends Timestamp {
   id: string;
   patientProfilId: string;
   variables: Record<string, string>;
}

export interface PatientProfilPersistence extends Timestamp {
   id: string;
   patientId: string;
   patientNeedsModelId: string;
   gender: "M" | "F" | "O";
   age: number;
   height: number;
   weight: number;
   physicalActivityLevel: "Sedentary" | "Lightly Active" | "Moderately Active" | "Very Active" | "Extremely Active";
   healthMetrics: HealthMetricPersistence[]
   medicalConditionIds: AggregateID[];
   objectiveIds: AggregateID[];
   otherInformations: Record<string, any>;
}
export interface PatientProfilPersistenceRecord extends Omit<PatientProfilPersistence, "medicalConditionIds" | "objectiveIds"> {
   medicalConditions: MedicalCondition[];
   objectives: Objective[];
}

export interface PatientNeedsModelPersistence extends Timestamp {
   id: string;
   modelType: "specific" | "standard";
   protocolName: string;
   protocolSource: INutritionalSource;
   energyMetrics: CreateNutrientDescriptorProps[];
   macronutrients: CreateNutrientDescriptorProps[];
   micronutrients: CreateNutrientDescriptorProps[];
   validationRules: CreateValidationRegularProps[];
   isValidModel: boolean;
}

export type NutrientDescriptorPersistence = CreateNutrientDescriptorProps;
export type PatientNeedsValidationRulePersistence = CreateValidationRegularProps;

export interface MedicalConditionPersistence extends Timestamp {
   id: string;
   name: string;
   standardMedicalConditionId?: string;
   severity: "severe" | "light" | "moderate";
   recommendations: NeedsRecommendationDto[];
   otherInformation: { [key: string]: any };
   healthIndicators: HealthIndicatorsPersistence[];
   description: string;
}
export interface ObjectivePersistence extends Timestamp {
   id: string;
   name: string;
   type: "General" | "Measure";
   status: "InProgress" | "Achieved" | "NotAchieved";
   description: string;
   unit?: string;
   timeframe: ITimeframe;
   measureCode?: string;
   initialValue?: number;
   targetValue?: number;
   currentValue?: number;
   recommendations: NeedsRecommendationDto[];
   standardObjectiveId?: string;
}
