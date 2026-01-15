import express from 'express';
import {sendMessage,fetchMessages} from '../controllers/message.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router= express.Router();


router.post('/messages',authMiddleware,sendMessage);

router.get('/messages/:chatId',authMiddleware,fetchMessages);


export default router;
