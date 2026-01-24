'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.professions = void 0;
const pg_core_1 = require('drizzle-orm/pg-core');
const pg_core_2 = require('drizzle-orm/pg-core');
// Either elite specializations or professions will be held here to determine character class
exports.professions = (0, pg_core_2.pgTable)('professions_static', {
  id: (0, pg_core_2.serial)('id').primaryKey(),
  eliteSpecId: (0, pg_core_1.integer)('elite_spec_id'),
  name: (0, pg_core_1.varchar)('name', { length: 20 }).notNull().unique(),
  profession: (0, pg_core_1.varchar)('profession', { length: 20 }).notNull(),
  icon: (0, pg_core_2.text)('icon').notNull(),
});
