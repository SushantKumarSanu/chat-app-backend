import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../errors/AppError.js';
import type { Request,Response,NextFunction } from 'express';

type AuthTokenPayload = {
    userId:string;
};

const authMiddleware = async(req:Request,res:Response,next:NextFunction)=>{

        const authHeader = req.headers.authorization
        if(!authHeader||!authHeader.startsWith('Bearer ')){
            throw new AppError("Not authorized,token missing",
                401
            );            
        }
        const token = authHeader.split(" ")[1];
        if(!token){
            throw new AppError(
                "Not authorized,token missing",
                401
            )
        };

        const jwtSecretKey = process.env.JWT_SECRET;

        if(!jwtSecretKey){
            throw Error("JWT_SECRET is not configured");
        };
        try {

            const decoded = jwt.verify(token,jwtSecretKey);            
            if (typeof decoded !== "object" || decoded === null || !("userId" in decoded) ||
            typeof decoded.userId !== "string")
            {
                throw new AppError("Invalid token payload", 401);
            }
            const user = await User.findById(decoded.userId);
            if(!user){
                throw new AppError("User not found",
                    401
                );
            };
            
            req.user = user ;

        } catch (error) {
            if (error instanceof Error && error.name === "JsonWebTokenError"){
                throw new AppError(
                    "Invalid token" ,
                    401
                );
            };
            if(error instanceof Error && error.name === "TokenExpiredError"){
                throw new AppError(
                    "Token Expired",
                    401
                );
            };
            throw error;
        }




        next();


}


export default authMiddleware;
