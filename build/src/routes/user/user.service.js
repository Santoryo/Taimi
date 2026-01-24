'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createUserInDb = createUserInDb;
const database_1 = require('../../database/database');
const user_model_1 = require('./user.model');
const gw2_service_1 = require('../../services/gw2.service');
const queue_1 = require('../../worker/queue');
async function createUserInDb(apiKey, auth_uid, twitchId) {
  const gw2Api = new gw2_service_1.Gw2Service(apiKey);
  const userData = await gw2Api.getAccount();
  const newUser = await database_1.db
    .insert(user_model_1.users)
    .values({
      id: userData.id,
      apiKey: apiKey,
      name: userData.name,
      created: new Date(userData.created),
      auth_uid: auth_uid,
      twitchId: twitchId,
    })
    .onConflictDoUpdate({
      target: user_model_1.users.id,
      set: { apiKey: apiKey },
    })
    .returning();
  await queue_1.characterQueue.add(
    'sync',
    { userId: newUser[0].id, apiKey },
    { priority: 1 },
  );
  return newUser;
}
