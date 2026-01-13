import User from "../models/User.js";
import jwt from "jsonwebtoken";


const generateToken = (userId) =>{
    return jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d",
    });
};



export const register = async(req,res)=>{
    try{
        const {username,email,password} = req.body;        
        if(!username||!email||!password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        const existinguser = await User.findOne({email});
        if(existinguser) {
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
        const {email,password}= req.body
            if(!email||!password){
                return res.status(400).json({
                message: "Email and password are required"
                });
            }

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
                id:user._id,
                username:user.username,
                email:user.email
            }
        })

    }catch(error){
        res.status(500).json({message: "Internal Server Error"});
    }
}
