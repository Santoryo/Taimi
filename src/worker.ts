import { Worker } from 'bullmq';
import { characterQueue, redisConnection } from './worker/queue';
import { processJob } from './worker/jobs';
import logger from './core/logger';
import './worker/scheduler';

logger.info('[Worker] Starting worker');

// characterQueue.obliterate({})

const worker = new Worker('character-sync', processJob, {
    connection: redisConnection,
    concurrency: 10,
});

worker.on('completed', (job) => logger.info(`Completed job for user ${job.data.userId}`));
worker.on('failed', (job, err) => logger.error(`Job failed for user ${job?.data.userId}: ${err.message}`));
