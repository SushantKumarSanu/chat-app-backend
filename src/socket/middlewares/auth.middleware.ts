import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import logger from '../../logger/logger.js';
import SocketError from '../errors/SocketError.js';
import type { Socket,ExtendedError } from 'socket.io';


const authMiddleware = async(socket:Socket,next:(error?:ExtendedError)=>void)=>{

        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new SocketError(
                "No token provided",
                "AUTHENTICATION_ERROR"
            ));
        };

        
        try {

            const jwtSecretKey = process.env.JWT_SECRET;

            if(!jwtSecretKey){
            throw Error("JWT_SECRET is not configured");
            };
            
            let decoded  = jwt.verify(token,jwtSecretKey);
            
            if (typeof decoded !== "object" || decoded === null || !("userId" in decoded) ||
            typeof decoded.userId !== "string")
            {
                throw new SocketError("Invalid token payload",
                    "INVALID_TOKEN"
                );
            }

            socket.userId = decoded.userId;

            const user = await User.findByIdAndUpdate(socket.userId,{isOnline:true});

            
            if(!user){
                return next( new SocketError("User not found",
                    "USER_NOT_FOUND"
                ));
            };



        } catch (error) {

            if (error instanceof Error && error.name === "JsonWebTokenError"){
                return next( new SocketError(
                    "Invalid token" ,
                    "AUTHENTICATION_ERROR"
                    ));
            };

            if(error instanceof Error && error.name === "TokenExpiredError"){
                return next( new SocketError(
                    "Token Expired",
                    "AUTHENTICATION_ERROR"
                ));
            };

            logger.error(
                {
                err: error,
                socketId: socket.id
                },
                "Unhandled socket authentication error"
            );

            return next(new Error("Something went wrong")); 

        }
        
        

        next();


};


export default authMiddleware;