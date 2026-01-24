'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.processJob = processJob;
const queue_1 = require('./queue');
const database_1 = require('../database/database');
const user_model_1 = require('../routes/user/user.model');
const character_service_1 = require('../routes/character/character.service');
const logger_1 = __importDefault(require('../core/logger'));
const gw2_db_service_1 = require('../services/gw2.db.service');
async function processJob(job) {
  switch (job.name) {
    case 'characters-update':
      return await handleCharacterUpdate(job.data);
    case 'accounts-fetch':
      return await handleAccountsFetch();
    case 'update-professions':
      return await handleUpdateProfessions();
    default:
      logger_1.default.warn(`[Worker] Unknown job name: ${job.name}`);
      return { success: false };
  }
}
async function handleUpdateProfessions() {
  await (0, gw2_db_service_1.updateProfessionsInDb)();
  return { success: true };
}
async function handleCharacterUpdate(data) {
  const { userId, apiKey } = data;
  logger_1.default.info(`[Worker] Updating characters for user ${userId}`);
  await (0, character_service_1.updateCharacterInDb)(apiKey, userId);
  return { success: true };
}
async function handleAccountsFetch() {
  logger_1.default.info('[Worker] Fetching all accounts');
  const accounts = await database_1.db
    .select({
      apiKey: user_model_1.users.apiKey,
      id: user_model_1.users.id,
    })
    .from(user_model_1.users);
  for (const account of accounts) {
    logger_1.default.info(`[Worker] Adding user ${account.id} to queue`);
    await queue_1.characterQueue.add(
      'characters-update',
      { userId: account.id, apiKey: account.apiKey },
      { priority: 10 },
    );
  }
  return { success: true };
}
