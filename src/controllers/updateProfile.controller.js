import {userNameSchema} from "../validators/updateProfile.validator.js"
import User from "../models/User.js";
export const updateUserName = async (req,res)=>{
    try{
        const {error} = userNameSchema.validate(req.body);
        if(error) return res.status(400).json({message:error.details[0].message.replace(/"/g, "")});  

        const {userName} = req.body;
        const user = await User.findByIdAndUpdate(req.user._id,
        {username:userName},
        {new:true,runValidators:true}
        );
        if(!user) return res.status(404).json({success:false,message: "User not found"});
        
        res.status(200).json({
        success:true,
        username:user.username
        }) ;
    }catch(error){
        res.status(500).json({error:error.message});
    }
};