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
} from 'tsoa';
import * as express from 'express';
import { UUID } from 'node:crypto';

@Route('users')
@Tags('Users')
export class UsersController extends Controller {
    @Post()
    @SuccessResponse('201', 'Created')
    @Security('supabase')
    public async createUser(@Body() body: { apiKey?: string }, @Request() req: express.Request) {
        const { apiKey = null } = body;

        if (!apiKey) {
            throw new Error('`apiKey` not found in body');
        }

        const user = await createUserInDb(apiKey, req.user.sub);

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

    @Get('/{username}/characters')
    public async getCharacterListByUsernameRoute(
        @Path() username: string,
        @Res() notFound: TsoaResponse<404, { message: string }>,
    ): Promise<string[]> {
        const usernames = await getCharacterListByUsername(username);
        return usernames;
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
