'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const bullmq_1 = require('bullmq');
const queue_1 = require('./worker/queue');
const jobs_1 = require('./worker/jobs');
const logger_1 = __importDefault(require('./core/logger'));
require('./worker/scheduler');
logger_1.default.info('[Worker] Starting worker');
// characterQueue.obliterate({})
const worker = new bullmq_1.Worker('character-sync', jobs_1.processJob, {
  connection: queue_1.redisConnection,
  concurrency: 10,
});
worker.on('completed', (job) =>
  logger_1.default.info(`Completed job for user ${job.data.userId}`),
);
worker.on('failed', (job, err) =>
  logger_1.default.error(
    `Job failed for user ${job?.data.userId}: ${err.message}`,
  ),
);
