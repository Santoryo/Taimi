import { integer, pgEnum, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { users } from "../user/user.model";
import { date } from "drizzle-orm/pg-core";
import { time } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";


export const characters = pgTable("characters", {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    race: varchar("race", {length: 20}).notNull(),
    profession: varchar("profession", { length: 100 }).notNull(),
    gender: varchar("gender", {length: 10}).notNull(),
    level: integer("level").notNull(),
    created: timestamp("created").notNull(),
    deaths: integer("deaths").notNull().default(0),
    age: integer("age").notNull().default(0),
    title: integer("title").notNull().default(0),
});

export const equipment = pgTable("equipment", {
    id: serial("id").primaryKey(),
    characterId: integer("character_id").notNull().references(() => characters.id, { onDelete: "cascade" }),
    itemId: integer("item_id").notNull(),
    slot: varchar("slot", { length: 100 }).notNull(),
    skinId: integer("skin_id"),
    statsId: integer("stats_id"),
    binding: varchar("binding", { length: 100 }),
    dyes: integer("dyes").array(),
    upgrades: integer("upgrades").array(),
    infusions: integer("infusions").array(),
});

export const specializationsPve = pgTable("specializations_pve", {
    id: serial("id").primaryKey(),
    characterId: integer("character_id").notNull().references(() => characters.id, { onDelete: "cascade" }),
    specializationId: integer("specialization_id").notNull(),
    traits: integer("traits").array().notNull(),
});

export type InsertCharacter = typeof characters.$inferInsert;
export type SelectCharacter = typeof characters.$inferSelect;

export type InsertEquipment = typeof equipment.$inferInsert;
export type SelectEquipment = typeof equipment.$inferSelect;

export type InsertSpecializationsPve = typeof specializationsPve.$inferInsert;
export type SelectSpecializationsPve = typeof specializationsPve.$inferSelect;