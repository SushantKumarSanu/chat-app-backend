import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { updateUserName } from '../controllers/updateProfile.controller.js';
import { updateAvatar } from '../controllers/updateAvatar.controller.js';
import upload from '../middlewares/upload.middleware.js';


const router = express.Router();



router.get("/userdetails",authMiddleware,(req,res)=>{
    res.status(200).json({
        message:"protected route accessed",
        user: req.user
    });
});

router.patch( '/username' , authMiddleware ,updateUserName);
router.patch("/avatar",authMiddleware,upload,updateAvatar);

export default router;