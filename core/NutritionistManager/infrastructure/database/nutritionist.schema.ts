import { integer, text, sqliteTable, AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
export type Contact = {
   email: string;
   phoneNumber: string;
};
export type Address = {
   street?: string;
   city?: string;
   postalCode?: string;
   country: string;
};
export type Speciality = {
   name: string;
   description?: string;
};
export type Images = string[];
export const consultationPlaces = sqliteTable("consultation_places", {
   id: text("id").primaryKey(),
   name: text("name").notNull(),
   address: text("address", { mode: "json" }).$type<Address>(),
   isOnline: integer("isOnline", { mode: "boolean" }),
   isPublic: integer("isPublic", { mode: "boolean" }),
   createdAt: text("createdAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
   updatedAt: text("updatedAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const services = sqliteTable("services", {
   id: text("id").primaryKey(),
   name: text("name").notNull(),
   type: text("type", { enum: ["Office Consultation", "Online Consultation", "Home Consultation", "Other"] }),
   patientType: text("patientType", { enum: ["New Patient", "Recurrent Patient", "All Patient"] }),
   duration: text("duration").notNull().default("00:30"),
   price: integer("price").notNull(),
   consultationPlaces: text("consultationPlaces", { mode: "json" }).$type<(string | number)[]>(),
   createdAt: text("createdAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
   updatedAt: text("updatedAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const nutritionists = sqliteTable("nutritionists", {
   id: text("id").primaryKey(),
   password: text("password").default(""),
   googleId: text("googleId").default(""),
   name: text("name").notNull(),
   email: text("email").notNull(),
   gender: text("gender", { enum: ["M", "F", "O"] }).default("O"),
   contact: text("contact", { mode: "json" }).$type<Contact>().notNull(),
   address: text("address", { mode: "json" }).$type<Address>().notNull(),
   birthday: text("birthday").default(""),
   specialities: text("specialities", { mode: "json" }).$type<Speciality[]>(),
   images: text("images", { mode: "json" }).$type<Images>(),
   consultationPlaceIds: text("consultationPlaceIds", { mode: "json" }).$type<(string | number)[]>(),
   serviceIds: text("serviceIds", { mode: "json" }).$type<(string | number)[]>(),
   createdAt: text("createdAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
   updatedAt: text("updatedAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const refreshTokens = sqliteTable("refresh_tokens", {
   id: integer("id").primaryKey(),
   nutritionistId: text("nutritionistId").references((): AnySQLiteColumn => nutritionists.id),
   token: text("token"),
   createdAt: text("createdAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
   updatedAt: text("updatedAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});
