import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { registerSchema } from "../validators/auth.validator.js";
import { loginSchema } from "../validators/auth.validator.js";

const generateToken = (userId) =>{
    return jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d",
    });
};



export const register = async(req,res)=>{
    try{
        const {error} = registerSchema.validate(req.body);
        if(error) return res.status(400).json({message:error.details[0].message});
        const {username,email,password} = req.body;        
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(409).json({message:"User already exist"});
        } 
        const user = await User.create({
            username,
            email,
            password
        });
        const token = generateToken(user._id);

        res.status(201).json({
            message:"User created successfully",
            token,
            user:{
                id:user._id,
                username:user.username,
                email: user.email
            }
        });
    }catch(error){
        res.status(500).json({message: "Internal Server Error"});

    }
};


export const login = async (req,res)=>{
    try{
        const {error} = loginSchema.validate(req.body);
        if(error) return res.status(400).json({message:error.details[0].message});
        const {email,password}= req.body;
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return res.status(401).json({message:"Invalid credentials"})
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
        }


        const token = generateToken(user._id);
        res.status(200).json({
            message:"login Successful",
            token,
            user:{
                _id:user._id,
                username:user.username,
                email:user.email
            }
        })

    }catch(error){
        res.status(500).json({message: "Internal Server Error"});
    }
}
