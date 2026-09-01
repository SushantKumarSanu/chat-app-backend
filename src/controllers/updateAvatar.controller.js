import streamifier from "streamifier";
import User from "../models/User.js";
import cloudinary from "../configs/cloudinary.js";
import AppError from "../errors/appError.js";


export const updateAvatar = async( req , res )=>{

        if(!req.file){
            throw new AppError(
                "Please upload the Image",
                400
            )
        };
        const user = await User.findById(req.user._id);
        if(!user) {
            throw new AppError(
                " User not found ", 
                404
            ); 
        };
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder:"chatapp/avatars" ,
                },
                (error,result)=>{
                    if(error) return reject(error);
                    resolve(result)
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);            
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