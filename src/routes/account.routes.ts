import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { changePassword } from '../controllers/account.controller.js';

const router = express.Router();


router.patch('/password',authMiddleware,changePassword);


export default router;