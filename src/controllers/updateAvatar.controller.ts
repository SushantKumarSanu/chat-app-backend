import streamifier from "streamifier";
import User from "../models/User.js";
import cloudinary from "../configs/cloudinary.js";
import AppError from "../errors/AppError.js";
import type { Request,Response } from "express";
import type { UploadApiResponse } from "cloudinary";

export const updateAvatar = async( req:Request , res:Response )=>{

        if(!req.file){
            throw new AppError(
                "Please upload the Image",
                400
            )
        };

        const file = req.file;
        const user = await User.findById(req.user._id);
        if(!user) {
            throw new AppError(
                " User not found ", 
                404
            ); 
        };
        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder:"chatapp/avatars" ,
                },
                (error,result)=>{
                    if(error) return reject(error);
                    if (!result) {
                        return reject(new Error("Cloudinary upload failed"));
                    }


                    resolve(result)
                }
                
            );
            streamifier.createReadStream(file.buffer).pipe(stream);            
        });

        if(user.avatar?.public_id){
            await cloudinary.uploader.destroy(user.avatar.public_id)
        };
        user.avatar = {
            public_id : result.public_id ,
            secure_url : result.secure_url
        };
        await user.save();

        res.status(200).json({success : true , user});

};