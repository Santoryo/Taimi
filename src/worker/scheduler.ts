import logger from "../core/logger";
import { characterQueue } from "./queue"
import cron from "node-cron";

logger.info("[Scheduler] Scheduling jobs...");

cron.schedule("*/30 * * * *", () => {
  characterQueue.add("accounts-fetch", {}, { priority: 10 });
});

cron.schedule("0 0 * * *", () => {
    characterQueue.add("update-professions", {}, { priority: 1 });
})

logger.info("[Scheduler] Scheduling completed");