import express from 'express';
import upload from '../middlewares/upload.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { updateAvatar } from '../controllers/updateAvatar.controller.js';

const router = express.Router();



router.get("/profile",authMiddleware,(req,res)=>{
    res.status(200).json({
        message:"protected route accessed",
        user: req.user
    });
});


router.patch("/avatar",authMiddleware,upload,updateAvatar);


export default router;