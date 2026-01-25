import { and, asc, eq, lt } from "drizzle-orm";
import { db } from "../../database/database";
import { users } from "./user.model";
import { Gw2Service } from "../../services/gw2.service";
import { Request } from "express";
import { UUID } from "crypto";
import { characterQueue } from "../../worker/queue";
import config from "../../config/config";
import { characters } from "../character/character.model";

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

    await characterQueue.add("characters-update", { userId: newUser[0].id, apiKey }, { priority: 1 });

    return newUser;
}

export async function requestCharactersUpdate(name: string): Promise<boolean> {
  const now = new Date();
  const cutoff = new Date(Date.now() - config.minimumUpdateTime);

  const updatedRows = await db
    .update(users)
    .set({ updated: now })
    .where(
      and(
        eq(users.name, name),
        lt(users.updated, cutoff)
      )
    )
    .returning({
        id: users.id,
        apiKey: users.apiKey
    });

  if (updatedRows.length === 0) {
    return false;
  }

  await characterQueue.add(
    "characters-update",
    { userId: updatedRows[0].id, apiKey: updatedRows[0].apiKey },
    { priority: 1 }
  );

  return true;
}

export async function getCharacterListByUsername(name: string): Promise<string[]>
{
    const uid = await db.select({user_id: users.id}).from(users).where(eq(users.name, name)).limit(1);

    if(uid.length == 0)
    {
        return [];
    }
    const characternames = await db.select({name: characters.name}).from(characters).where(eq(characters.userId, uid[0].user_id)).orderBy(asc(characters.accessedOrder));

    return characternames.map(c => c.name);
}