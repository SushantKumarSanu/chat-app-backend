import User from "../models/User.js";
import changePasswordSchema from "../validators/changePassword.validator.js";


export const changePassword = async(req,res)=>{ 
    try{
    const {error} = changePasswordSchema.validate(req.body);
    if(error) return res.status(400).json({message:error.details[0].message.replace(/"/g, ""),again:"this is from validator"});
    const {password,newPassword,confirmPassword}  = req.body;
    
    const user = await User.findById(req.user._id).select("+password");
    if(!user) return res.status(404).json({success:false,message: "User not found"});

    const isMatch = await user.comparePassword(password);
    if(!isMatch) return res.status(401).json({success:false,message: "Invalid password" });

    const isConfirmedPassword = newPassword === confirmPassword ;
    if (!isConfirmedPassword) return res.status(400).json({success:false,message: 'New password and confirmation password do not match.'});

    user.password = newPassword;
    await user.save();
    return res.status(200).json({success:true,message: 'Successfully changed password'});
    }catch(error){
        res.status(500).json({success:false,message:"Internal server error"});
    }
}