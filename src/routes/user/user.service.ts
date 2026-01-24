import { eq } from "drizzle-orm";
import { db } from "../../database/database";
import { users } from "./user.model";
import { Gw2Service } from "../../services/gw2.service";
import { Request } from "express";
import { UUID } from "crypto";
import { characterQueue } from "../../worker/queue";

export async function createUserInDb(apiKey: string, auth_uid?: string, twitchId?: number) {
    const gw2Api = new Gw2Service(apiKey);
    const userData = await gw2Api.getAccount();

    const newUser = await db
    .insert(users)
    .values({ id: userData.id, apiKey: apiKey, name: userData.name, created: new Date(userData.created), auth_uid: auth_uid, twitchId: twitchId })
    .onConflictDoUpdate({
        target: users.id,
        set: { apiKey: apiKey }
    }).returning();

    await characterQueue.add("sync", { userId: newUser[0].id, apiKey }, { priority: 1 });

    return newUser;
}