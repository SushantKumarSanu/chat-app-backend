import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { searchUsers } from '../controllers/user.controller.js';

const router = express.Router();

router.get("/search",authMiddleware,searchUsers)

export default router;