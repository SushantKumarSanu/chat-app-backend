import express from 'express';
import { accessChat,fetchChats } from "../controllers/chat.controller.js";
import authMiddleware from '../middlewares/auth.middleware.js';
const route =  express.Router();



route.post("/chats",authMiddleware,accessChat);
route.get("/chats",authMiddleware,fetchChats);


export default route;