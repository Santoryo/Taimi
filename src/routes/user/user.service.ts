import { and, asc, eq, lt } from 'drizzle-orm';
import { db } from '../../database/database';
import { users } from './user.model';
import { Gw2Service } from '../../services/gw2.service';
import { Request } from 'express';
import { UUID } from 'crypto';
import { characterQueue } from '../../worker/queue';
import config from '../../config/config';
import { characters } from '../character/character.model';

export async function createUserInDb(apiKey: string, auth_uid?: string, twitchId?: number) {
    const gw2Api = new Gw2Service(apiKey);
    const userData = await gw2Api.getAccount();

    const newUser = await db
        .insert(users)
        .values({
            id: userData.id,
            apiKey: apiKey,
            name: userData.name,
            created: new Date(userData.created),
            auth_uid: auth_uid,
            twitchId: twitchId,
        })
        .onConflictDoUpdate({
            target: users.id,
            set: { apiKey: apiKey },
        })
        .returning();

    await characterQueue.add('characters-update', { userId: newUser[0].id, apiKey }, { priority: 1 });

    return newUser;
}

export async function requestCharactersUpdate(username: string): Promise<{
    canUpdate: boolean;
    lastUpdateAt: string | null;
    nextUpdateAt: string | null;
    retryAfterSeconds: number | null;
} | null> {
    const now = Date.now();
    const cutoff = new Date(now - config.minimumUpdateTime);

    const updatedRows = await db
        .update(users)
        .set({ updated: new Date(now) })
        .where(and(eq(users.name, username), lt(users.updated, cutoff)))
        .returning({
            id: users.id,
            apiKey: users.apiKey,
            updated: users.updated,
        });

    if (updatedRows.length === 0) {
        const [user] = await db.select({ updated: users.updated }).from(users).where(eq(users.name, username)).limit(1);

        if (!user) {
            return {
                canUpdate: false,
                lastUpdateAt: null,
                nextUpdateAt: null,
                retryAfterSeconds: null,
            };
        }

        const last = user.updated?.getTime() ?? 0;
        const next = last + config.minimumUpdateTime;

        return {
            canUpdate: false,
            lastUpdateAt: new Date(last).toISOString(),
            nextUpdateAt: new Date(next).toISOString(),
            retryAfterSeconds: Math.ceil((next - now) / 1000),
        };
    }

    const row = updatedRows[0];
    await characterQueue.add('characters-update', { userId: row.id, apiKey: row.apiKey }, { priority: 1 });

    return {
        canUpdate: true,
        lastUpdateAt: new Date(now).toISOString(),
        nextUpdateAt: new Date(now + config.minimumUpdateTime).toISOString(),
        retryAfterSeconds: Math.ceil(config.minimumUpdateTime / 1000),
    };
}

export async function getCharacterListByUsername(name: string): Promise<string[]> {
    const uid = await db.select({ user_id: users.id }).from(users).where(eq(users.name, name)).limit(1);

    if (uid.length == 0) {
        return [];
    }
    const characternames = await db
        .select({ name: characters.name })
        .from(characters)
        .where(eq(characters.userId, uid[0].user_id))
        .orderBy(asc(characters.accessedOrder));

    return characternames.map((c) => c.name);
}
