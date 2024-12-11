import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import {
   FormularExpressionPersistence,
   HealthIndicatorsPersistence,
   NutrientDescriptorPersistence,
   PatientNeedsValidationRulePersistence,
} from "../repositories";
import { AggregateID, ITimeframe, NeedsRecommendationDto, PhysicalActivityLevel } from "@/core/shared";

export type NutrientModelGroup = NutrientDescriptorPersistence[];
export type NutritionalRef = {
   condition: string;
   weight: number;
   bme?: number;
   anr?: number;
   amt?: number;
   as?: number;
};
export type NutritionalSourcePersistenceType = {
   organization: string; // Nom de l'organisation (ex. "OMS", "Santé Canada")
   country: string; // Pays d'origine (ex. "Canada", "États-Unis")
   publicationYear: number; // Année de publication
   version?: string; // Version spécifique (facultatif)
};
export type Variables = {
   [variableAlias: string]: string;
};
export type PatientDataVariables = Record<string, string>;
export const nutritionalReferencesValues = sqliteTable("nutritional_reference_values", {
   id: text("id").primaryKey().notNull(),
   tagname: text("nutrientTagname").notNull(),
   source: text("source", { mode: "json" }).$type<NutritionalSourcePersistenceType>(),
   values: text("values", { mode: "json" }).$type<NutritionalRef[]>(),
   conditionVariables: text("variables", { mode: "json" }).$type<Variables>(),
   unit: text("unit").notNull(),
   systemVariableName: text("systemVariableName").notNull(),
   createdAt: text("createdAt").notNull(),
   updatedAt: text("updatedAt").notNull(),
});
export const nutritionFormulars = sqliteTable("nutrition_formulars", {
   id: text("id").primaryKey().notNull(),
   name: text("formularName").notNull(),
   formularExpressions: text("formularExpressions", { mode: "json" }).$type<FormularExpressionPersistence[]>(),
   conditionVariables: text("conditionVariables", { mode: "json" }).$type<Variables>(),
   source: text("source", { mode: "json" }).$type<NutritionalSourcePersistenceType>(),
   unit: text("unit").notNull(),
   systemVariableName: text("systemVariableName").notNull(),
   createdAt: text("createdAt").notNull(),
   updatedAt: text("updatedAt").notNull(),
});

export const patientDataVariables = sqliteTable("patient_data_variables", {
   id: text("id").primaryKey(),
   patientProfilId: text("patient_profil_id").unique().notNull(),
   variables: text("variables", { mode: "json" }).notNull().$type<PatientDataVariables>(),
   createdAt: text("createdAt").notNull(),
   updatedAt: text("updatedAt").notNull(),
});

export const patientNeedsModels = sqliteTable("patient_needs_models", {
   id: text("id").primaryKey().notNull(),
   modelType: text("model_type", { enum: ["specific", "standard"] }),
   protocolName: text("protocol_name"),
   protocolSource: text("protocol_source", { mode: "json" }).$type<NutritionalSourcePersistenceType>(),
   macronutrients: text("macronutrients", { mode: "json" }).$type<NutrientModelGroup>(),
   micronutrients: text("micronutrients", { mode: "json" }).$type<NutrientModelGroup>(),
   energyMetrics: text("energy_metrics", { mode: "json" }).$type<NutrientModelGroup>(),
   validationRules: text("validation_rules", { mode: "json" }).$type<PatientNeedsValidationRulePersistence[]>(),
   isValidModel: integer("is_valid_model", { mode: "boolean" }),
   createdAt: text("createdAt").notNull(),
   updatedAt: text("updatedAt").notNull(),
});

export const objectives = sqliteTable("objectives", {
   id: text("id").primaryKey(),
   name: text("name").notNull(),
   type: text("type", { enum: ["General", "Measure"] }).notNull(),
   status: text("status", { enum: ["InProgress", "Achieved", "NotAchieved"] }),
   description: text("description"),
   unit: text("unit"),
   timeframe: text("timeframe", { mode: "json" }).$type<ITimeframe>(),
   measureCode: text("measure_code"),
   initialValue: integer("initial_value"),
   targetValue: integer("target_value"),
   currentValue: integer("current_value"),
   recommendations: text("recommendations", { mode: "json" }).$type<NeedsRecommendationDto[]>(),
   standardObjectiveId: text("standard_objective_id"),
   otherInformation: text("other_information", { mode: "json" }).$type<{ [key: string]: any }>(),
   createdAt: text("createdAt").notNull(),
   updatedAt: text("updatedAt").notNull(),
});

export const medicalConditions = sqliteTable("medical_conditions", {
   id: text("id").primaryKey(),
   name: text("name"),
   standardMedicalConditionId: text("standard_medical_condition_id"),
   severity: text("severity", { enum: ["severe", "light", "moderate"] }),
   recommendations: text("recommendations", { mode: "json" }).$type<NeedsRecommendationDto[]>(),
   otherInformation: text("other_information", { mode: "json" }).$type<{ [key: string]: any }>(),
   healthIndicators: text("health_indicators", { mode: "json" }).$type<HealthIndicatorsPersistence[]>(),
   descriptions: text("descriptions"),
   createdAt: text("createdAt").notNull(),
   updatedAt: text("updatedAt").notNull(),
});

export const patientProfils = sqliteTable("patient_profils", {
   id: text("id").primaryKey(),
   patientId: text("patient_id").notNull(),
   patientNeedsModelId: text("patient_needs_model_id"),
   gender: text("gender", { enum: ["M", "F", "O"] }),
   age: integer("age"),
   height: integer("height"),
   weight: integer("weight"),
   physicalActivityLevel: text("physical_activity_level", {
      enum: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Extremely Active"],
   }),
   anthropometricMeasure: text("anthropometric_measure", { mode: "json" }).$type<HealthIndicatorsPersistence[]>(),
   bodyCompositionMeasure: text("body_composition_measure", { mode: "json" }).$type<HealthIndicatorsPersistence[]>(),
   medicalAnalyse: text("medical_analyses", { mode: "json" }).$type<HealthIndicatorsPersistence[]>(),
   medicalConditionIds: text("medical_condition_id", { mode: "json" }).$type<AggregateID[]>(),
   objectiveIds: text("objective_ids", { mode: "json" }).$type<AggregateID[]>(),
   otherInformation: text("other_information", { mode: "json" }).$type<{ [key: string]: any }>(),
   createdAt: text("createdAt").notNull(),
   updatedAt: text("updatedAt").notNull(),
});
