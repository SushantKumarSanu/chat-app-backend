import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import logger from '../../logger/logger.js';
import SocketError from '../errors/SocketError.js';




const authMiddleware = async(socket,next)=>{

        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new SocketError(
                "No token provided",
                "AUTHENTICATION_ERROR"
            ));
        };

        let decoded ;
        
        try {

            decoded = jwt.verify(token,process.env.JWT_SECRET);

            socket.userId = decoded.userId;

            const user = await User.findByIdAndUpdate(socket.userId,{isOnline:true});

            
            if(!user){
                return next( new SocketError("User not found",
                    "USER_NOT_FOUND"
                ));
            };



        } catch (error) {

            if (error.name === "JsonWebTokenError"){
                return next( new SocketError(
                    "Invalid token" ,
                    "AUTHENTICATION_ERROR"
                    ));
            };

            if(error.name === "TokenExpiredError"){
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