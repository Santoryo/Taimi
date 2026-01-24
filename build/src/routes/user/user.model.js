'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.users = void 0;
const pg_core_1 = require('drizzle-orm/pg-core');
const pg_core_2 = require('drizzle-orm/pg-core');
const pg_core_3 = require('drizzle-orm/pg-core');
const pg_core_4 = require('drizzle-orm/pg-core');
exports.users = (0, pg_core_4.pgTable)('users', {
  auth_uid: (0, pg_core_2.uuid)('auth_uid').unique(),
  id: (0, pg_core_4.varchar)('id', { length: 36 }).primaryKey().unique(),
  name: (0, pg_core_4.varchar)('name', { length: 255 }).notNull(),
  created: (0, pg_core_3.timestamp)('created').notNull(),
  apiKey: (0, pg_core_4.text)('api_key').unique(),
  twitchId: (0, pg_core_1.integer)('twitch_id').unique(),
});
