import { Response, NextFunction } from 'express';
import { db } from '../../database/database';
import { users } from './user.model';
import { createUserInDb, getCharacterListByUsername, requestCharactersUpdate } from './user.service';
import { eq } from 'drizzle-orm';
import {
    Body,
    Controller,
    Post,
    Route,
    SuccessResponse,
    Tags,
    Request,
    Delete,
    Middlewares,
    Security,
    Path,
    Get,
    Res,
    TsoaResponse,
    Query,
} from 'tsoa';
import * as express from 'express';
import { UUID } from 'node:crypto';

@Route('users')
@Tags('Users')
export class UsersController extends Controller {
    @Post()
    @SuccessResponse('201', 'Created')
    @Security('supabase')
    public async createUser(@Body() body: { apiKey?: string, twitchId?: number }, @Request() req: express.Request) {
        const { apiKey = null, twitchId = undefined } = body;

        if (!apiKey) {
            throw new Error('`apiKey` not found in body');
        }

        const user = await createUserInDb(apiKey, req.user.sub, twitchId);

        this.setStatus(201);
        return user;
    }

    @Delete()
    @SuccessResponse('200', 'Deleted')
    @Security('supabase')
    public async deleteUser(@Request() req: express.Request) {
        const user = await db.delete(users).where(eq(users.auth_uid, req.user.sub)).returning();

        return user;
    }

    @Get()
    @Security('supabase')
    public async getUser(@Request() req: express.Request)
    {
      const [user] = await db.select().from(users).where(eq(users.auth_uid, req.user.sub)).limit(1);
      if(!user) return null;
      return user;
    }

    @Get('/{username}/characters')
    public async getCharacterListByUsernameRoute(
        @Path() username: string,
        @Res() notFound: TsoaResponse<404, { message: string }>,
    ): Promise<string[]> {
        const usernames = await getCharacterListByUsername(username);
        return usernames;
    }

    @Get('/twitch/{twitchId}')
    public async getUsernameForTwitchId(
        @Path() twitchId: number,
        @Res() notFound: TsoaResponse<404, { message: string }>,
    ): Promise<{username: string} | {message: string}> {
        const [user] = await db.select({username: users.name}).from(users).where(eq(users.twitchId, twitchId)).limit(1);
        if(!user) throw new Error("twitchId not found");
        return user;
    }



    @Post('{username}/characters/update')
    public async requestUpdateNowForUser(
        @Path() username: string,
        @Res() tooSoon: TsoaResponse<429, { message: string; retryAfterSeconds: number }>,
    ) {
        const status = await requestCharactersUpdate(username);

        if (!status) {
            return tooSoon(429, { message: 'User not found', retryAfterSeconds: 0 });
        }

        if (!status.canUpdate) {
            this.setHeader('Retry-After', status.retryAfterSeconds!.toString());
            return tooSoon(429, {
                message: 'Update cooldown active',
                retryAfterSeconds: status.retryAfterSeconds!,
            });
        }

        this.setStatus(202);
        return status;
    }
}
