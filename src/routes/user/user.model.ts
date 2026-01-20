
import { uuid } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    auth_uid: uuid("auth_uid").unique().notNull(),
    id: varchar("id", { length: 36} ).primaryKey().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    created: timestamp("created").notNull(),
    apiKey: text("api_key").unique(),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
