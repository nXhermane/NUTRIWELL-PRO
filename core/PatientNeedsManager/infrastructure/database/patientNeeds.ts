import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { FormularExpressionPersistence } from "../repositories";
import { INutritionalSource } from "@/core/shared";

export type NutritionalRef = {
   condition: string;
   weight: number;
   bme?: number;
   anr?: number;
   amt?: number;
   as?: number;
};
export type Variables = {
   [variableAlias: string]: string;
};
export type PatientDataVariables = Record<string, string>;
export const nutritionalReferencesValues = sqliteTable("nutritional_reference_values", {
   id: text("id").primaryKey(),
   tagname: text("nutrientTagname"),
   origin: text("origin"),
   value: text("value", { mode: "json" }).$type<NutritionalRef[]>(),
   conditionVariables: text("variables", { mode: "json" }).$type<Variables>(),
   unit: text("unit").notNull(),
   createdAt: text("createdAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
   updatedAt: text("updatedAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});
export const nutritionFormulars = sqliteTable("nutrition_formulars", {
   id: text("id").primaryKey(),
   name: text("formularName").notNull(),
   formularExpressions: text("formularExpressions", { mode: "json" }).$type<FormularExpressionPersistence[]>(),
   conditionVariables: text("conditionVariables", { mode: "json" }).$type<Variables>(),
   source: text("source", { mode: "json" }).$type<INutritionalSource>(),
   createdAt: text("createdAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
   updatedAt: text("updatedAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const patientDataVariables = sqliteTable("patient_data_variables", {
   id: text("id").primaryKey(),
   patientProfilId: text("patient_profil_id").unique().notNull(),
   variables: text("variables", { mode: "json" }).notNull().$type<PatientDataVariables>(),
   createdAt: text("createdAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
   updatedAt: text("updatedAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});
