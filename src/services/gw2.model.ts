import { integer, varchar } from "drizzle-orm/pg-core";
import { boolean } from "drizzle-orm/pg-core";
import { pgTable, serial, text } from "drizzle-orm/pg-core";

// Either elite specializations or professions will be held here to determine character class
export const professions = pgTable("professions_static", {
    id: serial("id").primaryKey(),
    eliteSpecId: integer("elite_spec_id"),
    name: varchar("name", { length: 20 }).notNull().unique(),
    profession: varchar("profession", { length: 20 }).notNull(),
    icon: text("icon").notNull()
});