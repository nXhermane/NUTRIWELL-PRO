import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

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
   expression: text("formularExpression").notNull(),
   condition: text("formularCondition").default("1"),
   variables: text("variables", { mode: "json" }).$type<Variables>(),
   createdAt: text("createdAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
   updatedAt: text("updatedAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});
