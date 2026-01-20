import { Request, Response, NextFunction } from 'express';
import { db } from '../../database/database';
import { characters } from './character.model';
import { error } from 'node:console';

export const getCharacterById = async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        // Logic to get character by ID
        res.json({ message: `Character with ID: ${id}` });
    } catch (error) {
        next(error);
    }
};

export const createCharacter = async(req: Request, res: Response, next: NextFunction) => {



}