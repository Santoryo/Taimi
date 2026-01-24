'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const logger_1 = __importDefault(require('../core/logger'));
const queue_1 = require('./queue');
const node_cron_1 = __importDefault(require('node-cron'));
logger_1.default.info('[Scheduler] Scheduling jobs...');
node_cron_1.default.schedule('*/30 * * * *', () => {
  queue_1.characterQueue.add('accounts-fetch', {}, { priority: 10 });
});
node_cron_1.default.schedule('0 0 * * *', () => {
  queue_1.characterQueue.add('update-professions', {}, { priority: 1 });
});
logger_1.default.info('[Scheduler] Scheduling completed');
