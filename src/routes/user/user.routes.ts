import express from 'express';
import { createUser, deleteUser } from './user.controller';
import { authGuard } from '../../middlewares/authGuard';

const router = express.Router();

router.post('/', authGuard, createUser);
router.delete('/', authGuard, deleteUser);

export default router;