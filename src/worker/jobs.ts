import { Job } from 'bullmq';
import { characterQueue } from './queue';
import { db } from '../database/database';
import { users } from '../routes/user/user.model';
import { updateCharacterInDb } from '../routes/character/character.service';
import logger from '../core/logger';
import { updateProfessionsInDb } from '../services/gw2.db.service';

export async function processJob(job: Job) {
    switch (job.name) {
        case 'characters-update':
            return await handleCharacterUpdate(job.data);
        case 'accounts-fetch':
            return await handleAccountsFetch();
        case 'update-professions':
            return await handleUpdateProfessions();
        default:
            logger.warn(`[Worker] Unknown job name: ${job.name}`);
            return { success: false };
    }
}

async function handleUpdateProfessions() {
    await updateProfessionsInDb();
    return { success: true };
}

async function handleCharacterUpdate(data: { userId: string; apiKey: string }) {
    const { userId, apiKey } = data;
    logger.info(`[Worker] Updating characters for user ${userId}`);
    await updateCharacterInDb(apiKey, userId);
    return { success: true };
}

async function handleAccountsFetch() {
    logger.info('[Worker] Fetching all accounts');
    const accounts = await db
        .select({
            apiKey: users.apiKey,
            id: users.id,
        })
        .from(users);

    for (const account of accounts) {
        logger.info(`[Worker] Adding user ${account.id} to queue`);
        await characterQueue.add('characters-update', { userId: account.id, apiKey: account.apiKey }, { priority: 10 });
    }

    return { success: true };
}
