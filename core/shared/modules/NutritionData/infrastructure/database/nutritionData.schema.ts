import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const measurementTypes = sqliteTable("measurement_types", {
   id: text("id").primaryKey(),
   name: text("name"),
   nameF: text("nameF"),
   measureCategory: text("measureCategory", { enum: ["Antropometry", "MedicalAnalysis", "BodyComposition"] }),
   measureCode: text("measureCode").unique(),
   unit: text("unit"),
});
