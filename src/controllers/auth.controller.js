import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { registerSchema } from "../validators/auth.validator.js";
import { loginSchema } from "../validators/auth.validator.js";
import AppError from "../errors/appError.js";

const generateToken = (userId) =>{
    return jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d",
    });
};



export const register = async(req,res)=>{
        const {error} = registerSchema.validate(req.body);
        if(error){
            throw new AppError(
                error.details[0].message.replace(/"/g, ""),
                400
            );
            
        } 
        const {userName,email,password,confirmPassword} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser) {
            throw new AppError(
                "User already exist",
                409
            );            
        } 
        const isConfirmedPassword = password===confirmPassword;
        if(!isConfirmedPassword){
            throw new AppError(
                "New password and confirmation password do not match.",
                400
            );
            
        };      

        const user = await User.create({
            username: userName ,
            email,
            password
        });
        const token = generateToken(user._id);

        res.status(201).json({
            message:"User created successfully",
            token,
            user
        });
};


export const login = async (req,res)=>{
        const {error} = loginSchema.validate(req.body);
        if(error){
            throw new AppError(
                error.details[0].message.replace(/"/g, ""),
                400
            );
            
        };
        const {email,password}= req.body;
        const user = await User.findOne({email}).select("+password");
        if(!user){
            throw new AppError(
                "Invalid credentials",
                401
            );
            
        };
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            throw new AppError("Invalid credentials",
                401
            );
        };

        const token = generateToken(user._id);
        res.status(200).json({
            message:"login Successful",
            token,
            user
        })


}
