import { eq } from "drizzle-orm";
import { db } from "../../database/database";
import { users } from "./user.model";
import { Gw2Service } from "../../services/gw2.service";
import { Request } from "express";
import { UUID } from "crypto";

export async function createUserInDb(apiKey: string, req: Request) {
    console.log(apiKey);

    const gw2Api = new Gw2Service(apiKey);
    const userData = await gw2Api.getAccount();

    const newUser = await db
    .insert(users)
    .values({ id: userData.id, apiKey: apiKey, name: userData.name, created: new Date(userData.created), auth_uid: req.user?.id as UUID })
    .onConflictDoUpdate({
        target: users.id,
        set: { apiKey: apiKey }
    }).returning();

    return newUser;
}