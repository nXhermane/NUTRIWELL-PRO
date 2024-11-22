import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
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
export type Images = string[];
export const patients = sqliteTable("patients", {
   id: text("id").primaryKey(),
   name: text("name").notNull().default(""),
   gender: text("gender", { enum: ["M", "F", "O"] }),
   contact: text("contact", { mode: "json" }).$type<Contact>(),
   address: text("address", { mode: "json" }).$type<Address>(),
   birthday: text("birthday"),
   occupation: text("occupation"),
   images: text("images", { mode: "json" }).$type<Images>(),
   createdAt: text("createdAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
   updatedAt: text("updatedAt")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});
