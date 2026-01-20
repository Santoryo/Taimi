import express from 'express';
import { createCharacter, getCharacterById } from './character.controller';

const router = express.Router();


router.get("/:id", getCharacterById);
router.post("/:name", createCharacter);

export default router;