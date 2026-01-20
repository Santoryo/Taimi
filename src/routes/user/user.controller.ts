import { Request, Response, NextFunction } from 'express';
import { db } from '../../database/database';
import { users } from './user.model';
import { createUserInDb } from './user.service';
import { eq } from 'drizzle-orm';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body) {
            throw new Error("`apiKey` not found in body");
        }

        const { apiKey = null } = req.body;
        const user = await createUserInDb(apiKey, req);

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await db.delete(users).where(eq(req.user.id, users.auth_uid)).returning();

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}