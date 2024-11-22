import { integer, text, sqliteTable, AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Types
export type Images = string[];
export type AggregateIDArray = (string | number)[];
export type FoodType = { name: string; foodId: number | string };
export type Quantity = {
   value: number;
   unit: string;
};
export type WaterConsumption = {
   lowerBound: number;
   upperBound: number | null;
};
export type MealType = {
   withCompany: boolean;
   watchingTv: boolean;
   sittingAtTable: boolean;
   foodItems: {
      foodId?: number | string;
      recipeId?: number | string;
      isRecipe: boolean;
      isHomeMade: boolean;
      quantity: Quantity;
   }[];
   mealTypeId: number | string;
   description: string;
};
export type ObjectiveBody =
   | {
        measureTypeId: number | string;
        value: number;
        description?: string;
     }
   | { description: string };

export type TimeFrame = {
   start: string;
   end: string;
};

export type Measurement = {
   date: string;
   measureTypeId: string | number;
   value: number;
   unit: string;
};
export type EatingBehavior = {
   date: string;
   eatingBehavior: string;
};

export const medicalStories = sqliteTable("medical_stories", {
   id: text("id").primaryKey(),
   pathologies: text("pathologies"),
   drugie: text("drugie"),
   personalBackground: text("personalBackground"),
   familyBackground: text("familyBackground"),
   otherInformation: text("otherInformation"),
   createdAt: text("createdAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
   updatedAt: text("updatedAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const foodStories = sqliteTable("food_stories", {
   id: text("id").primaryKey(),
   bedtime: text("bedtime"),
   wakeUpTime: text("wakeUpTime"),
   dietTypes: text("dietTypes", { mode: "json" }).$type<AggregateIDArray>(),
   favoriteFoods: text("favoriteFoods", { mode: "json" }).$type<FoodType[]>(),
   foodAversions: text("foodAversions", { mode: "json" }).$type<FoodType[]>(),
   foodIntolerances: text("foodIntolerances", { mode: "json" }).$type<AggregateIDArray>(),
   nutritionalDeficiencies: text("nutritionalDeficiencies", { mode: "json" }).$type<AggregateIDArray>(),
   waterConsumption: text("waterConsumption", { mode: "json" }).$type<WaterConsumption>(),
   numberOfMealsPerDay: integer("numberOfMealsPerDay"),
   otherInformation: text("otherInformation"),
   createdAt: text("createdAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
   updatedAt: text("updatedAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const personalAndSocialStories = sqliteTable("personal_and_social_stories", {
   id: text("id").primaryKey(),
   gastrointestinalState: text("gastrointestinalState", { enum: ["Regular", "Diarrhea", "Constipation", "Irregular"] }),
   sleepQuality: text("sleepQuality", { enum: ["Very good", "Good", "Fair", "Poor", "Very poor"] }),
   maritalStatus: text("maritalStatus", { enum: ["Single", "Married", "Divorced", "Widowed"] }),
   physicalActivity: text("physicalActivity", { enum: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Extremely Active"] }),
   ethnicity: text("ethnicity", { enum: ["Caucasian", "Asian", "Black"] }),
   isSmoker: integer("isSmoker", { mode: "boolean" }),
   isAlcoholConsumer: integer("isAlcoholConsumer", { mode: "boolean" }),
   otherInformation: text("otherInformation"),
   createdAt: text("createdAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
   updatedAt: text("updatedAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const foodDiaries = sqliteTable("food_diaries", {
   id: text("id").primaryKey(),
   date: integer("date", { mode: "timestamp" }),
   meal: text("meal", { mode: "json" }).$type<MealType>(),
   observation: text("observation"),
   images: text("images", { mode: "json" }).$type<Images>(),
   createdAt: text("createdAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
   updatedAt: text("updatedAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const objectives = sqliteTable("objectives", {
   id: text("id").primaryKey(),
   type: text("type", { enum: ["Measure", "General"] }),
   timeframe: text("timeframe", { mode: "json" }).$type<TimeFrame>(),
   body: text("body", { mode: "json" }).$type<ObjectiveBody>(),
   status: text("status", { enum: ["InProgress", "Achieved", "NotAchieved"] }),
   createdAt: text("createdAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
   updatedAt: text("updatedAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const patientMeasurements = sqliteTable("patient_measurements", {
   id: text("id").primaryKey(),
   anthropometricMeasurements: text("anthropometricMeasurements", { mode: "json" }).$type<Measurement[]>(),
   bodyCompositionMeasurements: text("bodyCompositionMeasurements", { mode: "json" }).$type<Measurement[]>(),
   medicalAnalysisResults: text("medicalAnalysisResults", { mode: "json" }).$type<Measurement[]>(),
   createdAt: text("createdAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
   updatedAt: text("updatedAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const consultationInformations = sqliteTable("consultation_informations", {
   id: text("id").primaryKey(),
   consultationMotive: text("consultationMotive"),
   expectations: text("expectations"),
   clinicalObjective: text("clinicalObjective"),
   otherInformation: text("otherInformation"),
   createdAt: text("createdAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
   updatedAt: text("updatedAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const medicalRecords = sqliteTable("medical_records", {
   id: text("id").primaryKey(),
   patientId: text("patientId"),
   medicalStoryId: text("medicalStoryId").references((): AnySQLiteColumn => medicalStories.id),
   foodStoryId: text("foodStoryId").references((): AnySQLiteColumn => foodStories.id),
   foodDiaryIds: text("foodDiaryIds", { mode: "json" }).$type<(number | string)[]>(),
   objectiveIds: text("objectiveIds", { mode: "json" }).$type<(number | string)[]>(),
   patientMeasurementId: text("patientMeasurementId").references((): AnySQLiteColumn => patientMeasurements.id),
   personalAndSocialStorieId: text("personalAndSocialStorieId").references((): AnySQLiteColumn => personalAndSocialStories.id),
   consultationInformationId: text("consultationInformationId").references((): AnySQLiteColumn => consultationInformations.id),
   status: text("status", { enum: ["Active", "New", "Inactive"] }),
   eatingBehaviors: text("eatingBehaviors", { mode: "json" }).$type<EatingBehavior[]>(),
   createdAt: text("createdAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
   updatedAt: text("updatedAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});
