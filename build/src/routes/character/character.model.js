'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.SkillsPve =
  exports.specializationsPve =
  exports.equipment =
  exports.characters =
    void 0;
const pg_core_1 = require('drizzle-orm/pg-core');
const user_model_1 = require('../user/user.model');
const pg_core_2 = require('drizzle-orm/pg-core');
exports.characters = (0, pg_core_1.pgTable)('characters', {
  id: (0, pg_core_1.serial)('id').primaryKey(),
  userId: (0, pg_core_1.varchar)('user_id', { length: 36 })
    .notNull()
    .references(() => user_model_1.users.id, { onDelete: 'cascade' }),
  name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull().unique(),
  race: (0, pg_core_1.varchar)('race', { length: 20 }).notNull(),
  profession: (0, pg_core_1.varchar)('profession', { length: 100 }).notNull(),
  elite: (0, pg_core_1.varchar)('elite', { length: 100 }),
  gender: (0, pg_core_1.varchar)('gender', { length: 10 }).notNull(),
  level: (0, pg_core_1.integer)('level').notNull(),
  deaths: (0, pg_core_1.integer)('deaths').notNull().default(0),
  age: (0, pg_core_1.integer)('age').notNull().default(0),
  title: (0, pg_core_1.integer)('title').notNull().default(0),
  accessedOrder: (0, pg_core_1.integer)('accessed_order').notNull(),
  created: (0, pg_core_2.timestamp)('created').notNull(),
  updated: (0, pg_core_2.timestamp)('updated').defaultNow().notNull(),
});
exports.equipment = (0, pg_core_1.pgTable)(
  'equipment',
  {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    characterId: (0, pg_core_1.integer)('character_id')
      .notNull()
      .references(() => exports.characters.id, { onDelete: 'cascade' }),
    itemId: (0, pg_core_1.integer)('item_id').notNull(),
    slot: (0, pg_core_1.varchar)('slot', { length: 100 }).notNull(),
    skinId: (0, pg_core_1.integer)('skin_id'),
    statsId: (0, pg_core_1.integer)('stats_id'),
    binding: (0, pg_core_1.varchar)('binding', { length: 100 }),
    dyes: (0, pg_core_1.integer)('dyes').array(),
    upgrades: (0, pg_core_1.integer)('upgrades').array(),
    infusions: (0, pg_core_1.integer)('infusions').array(),
  },
  (table) => ({
    characterSlotUnique: (0, pg_core_1.uniqueIndex)().on(
      table.characterId,
      table.slot,
    ),
  }),
);
exports.specializationsPve = (0, pg_core_1.pgTable)(
  'specializations_pve',
  {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    characterId: (0, pg_core_1.integer)('character_id')
      .notNull()
      .references(() => exports.characters.id, { onDelete: 'cascade' }),
    index: (0, pg_core_1.integer)('index').notNull(),
    specId: (0, pg_core_1.integer)('spec_id'),
    traits: (0, pg_core_1.integer)('traits').array(),
  },
  (table) => ({
    specializationSlotUnique: (0, pg_core_1.uniqueIndex)().on(
      table.characterId,
      table.index,
    ),
  }),
);
exports.SkillsPve = (0, pg_core_1.pgTable)('skills_pve', {
  id: (0, pg_core_1.serial)('id').primaryKey(),
  characterId: (0, pg_core_1.integer)('character_id')
    .notNull()
    .references(() => exports.characters.id, { onDelete: 'cascade' })
    .unique(),
  heal: (0, pg_core_1.integer)('heal'),
  utilities: (0, pg_core_1.integer)('utilities').array(3),
  elite: (0, pg_core_1.integer)('elite'),
});
