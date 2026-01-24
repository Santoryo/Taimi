import { Response, NextFunction } from 'express';
import { db } from '../../database/database';
import { users } from './user.model';
import { createUserInDb } from './user.service';
import { eq } from 'drizzle-orm';
import { Body, Controller, Post, Route, SuccessResponse, Tags, Request, Delete, Middlewares, Security } from 'tsoa';
import * as express from "express";
import { UUID } from 'node:crypto';

@Route("users")
@Tags("Users")
export class UsersController extends Controller {
  /**
   * Create a user
   */
  @Post()
  @SuccessResponse("201", "Created")
  @Security("supabase")
  public async createUser(
    @Body() body: { apiKey?: string },
    @Request() req: express.Request
  ) {

    const { apiKey = null } = body;

    if (!apiKey) {
      throw new Error("`apiKey` not found in body");
    }

    const user = await createUserInDb(apiKey, req.user.sub);

    this.setStatus(201);
    return user;
  }

  /**
   * Delete the authenticated user
   */
  @Delete()
  @SuccessResponse("200", "Deleted")
  @Security("supabase")
  public async deleteUser(
    @Request() req: express.Request
  ) {
    const user = await db
      .delete(users)
      .where(eq(users.auth_uid, req.user.sub))
      .returning();

    return user;
  }
}


// export const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         if (!req.body) {
//             throw new Error("`apiKey` not found in body");
//         }

//         const { apiKey = null } = req.body;
//         const user = await createUserInDb(apiKey, req);

//         res.status(201).json(user);
//     } catch (error) {
//         next(error);
//     }
// };

// export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user = await db.delete(users).where(eq(req.user.id, users.auth_uid)).returning();

//         res.status(201).json(user);
//     } catch (error) {
//         next(error);
//     }
// }