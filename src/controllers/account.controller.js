import AppError from "../errors/appError.js";
import User from "../models/User.js";
import changePasswordSchema from "../validators/changePassword.validator.js";


export const changePassword = async(req,res)=>{ 
    const {error} = changePasswordSchema.validate(req.body);

    if(error){
        throw new AppError(
            error.details[0].message.replace(/"/g, ""),
            400
        )

    };    
    const {password,newPassword,confirmPassword}  = req.body;
    
    const user = await User.findById(req.user._id).select("+password");
    if(!user){
        throw new AppError(
            "User not found",
            404
        );
        
    };

    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        throw new AppError(
            "Invalid password",
            401
        );
        
    };

    const isConfirmedPassword = newPassword === confirmPassword ;
    if (!isConfirmedPassword){
        throw new AppError(
            "New password and confirmation password do not match.",
            400
        );
        
    }

    user.password = newPassword;
    await user.save();
    return res.status(200).json({success:true,message: 'Successfully changed password'});

}