import {userNameSchema} from "../validators/updateProfile.validator.js"
import User from "../models/User.js";
import AppError from "../errors/appError.js";
export const updateUserName = async (req,res)=>{
        const {error} = userNameSchema.validate(req.body);
        if(error){
            throw new AppError(
                error.details[0].message.replace(/"/g, ""),
                400            
            );
            
        }   

        const {userName} = req.body;
        const user = await User.findByIdAndUpdate(req.user._id,
        {username:userName},
        {new:true,runValidators:true}
        );
        
        if(!user){
            throw new AppError(
                "User not found",
                404
            )
        };
        
        res.status(200).json({
        success:true,
        username:user.username
        }) ;

};