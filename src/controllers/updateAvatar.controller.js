import streamifier from "streamifier";
import User from "../models/User.js";
import cloudinary from "../configs/cloudinary.js";


export const updateAvatar = async( req , res )=>{

    try {

        if(!req.file) return res.status(400).json({ success:false , message:"Please upload the Image"});

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

        const user = await User.findById(req.user._id);
        if(!user) return res.status(404).json({ success : false , message : " User not found "});

        if(user.avatar?.public_id){
            await cloudinary.uploader.destroy(user.avatar.public_id)
        };
        user.avatar = {
            public_id : result.public_id ,
            secure_url : result.secure_url
        };
        await user.save();

        res.status(200).json({success : true , user});
    } catch(error) {
        res.status(500).json({message:"Internal Server Error",error:error.stack,errorMessage:error.message});
    }
};