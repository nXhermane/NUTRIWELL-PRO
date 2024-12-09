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
export type NutritionalSourcePersistenceType = {
   organization: string; // Nom de l'organisation (ex. "OMS", "Santé Canada")
   country: string; // Pays d'origine (ex. "Canada", "États-Unis")
   publicationYear: number; // Année de publication
   version?: string; // Version spécifique (facultatif)
}
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
   createdAt: text("createdAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
   updatedAt: text("updatedAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});
export const nutritionFormulars = sqliteTable("nutrition_formulars", {
   id: text("id").primaryKey().notNull(),
   name: text("formularName").notNull(),
   formularExpressions: text("formularExpressions", { mode: "json" }).$type<FormularExpressionPersistence[]>(),
   conditionVariables: text("conditionVariables", { mode: "json" }).$type<Variables>(),
   source: text("source", { mode: "json" }).$type<NutritionalSourcePersistenceType>(),
   unit : text("unit").notNull(),
   systemVariableName: text("systemVariableName").notNull(),
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
