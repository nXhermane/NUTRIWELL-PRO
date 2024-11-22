import { IHealthIndicator, ITimeframe, NeedsRecommendationDto } from "@/core/shared";
import { RecommendationPriority } from "@/core/shared/modules/NeedsRecommendations/RecommendationPriority";
import { sql } from "drizzle-orm";
import { integer, numeric, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ExpressionPersistenceType, } from "../types";
type RecommendationPersistenceType = NeedsRecommendationDto


export const standardObjectives = sqliteTable("standard_obejctived", {
    id: text("id").primaryKey(),
    name: text("name"),
    type: text("type", { enum: ["General", "Measure"] }).notNull(),
    timefrane: text("timefrane", { mode: "json" }).$type<ITimeframe>(),
    description: text("description"),
    measureCode: text("measureCode"),
    measureUnit: text("unit"),
    initialValue: integer("initialValue"),
    targetValue: integer("targetValue"),
    recommendations: text("recommendations", { mode: "json" }).$type<RecommendationPersistenceType[]>(),
    createdAt: text("createdAt")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updatedAt")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`)
        .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
})


export const standardMedicalConditions = sqliteTable('standard_medical_conditions', {
    id: text('id').primaryKey(),
    name: text('name'),
    description: text('description'),
    criteria: text('criteria', { mode: "json" }).$type<ExpressionPersistenceType>(),
    recommendations: text('recommendations', { mode: 'json' }).$type<RecommendationPersistenceType[]>(),
    healthIndicators: text('health indicators', { mode: 'json' }).$type<IHealthIndicator[]>(),
    createdAt: text('createdAt')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updatedAt')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`)
        .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
}
)