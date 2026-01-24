import { ConnectionOptions, Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({ maxRetriesPerRequest: null }) as ConnectionOptions;

export const characterQueue = new Queue("character-sync", {connection});
export const redisConnection = connection;