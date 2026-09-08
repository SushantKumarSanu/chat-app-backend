import express from 'express';
import { accessChat,fetchChats } from "../controllers/chat.controller.js";
import authMiddleware from '../middlewares/auth.middleware.js';
const router =  express.Router();



router.post("/chats",authMiddleware,accessChat);
router.get("/chats",authMiddleware,fetchChats);


export default router;