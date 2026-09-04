import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../errors/appError.js';


const authMiddleware = async(req,res,next)=>{

        const authHeader = req.headers.authorization
        if(!authHeader||!authHeader.startsWith('Bearer ')){
            throw new AppError("Not authorized,token missing",
                401
            );            
        }
        const token = authHeader.split(" ")[1];

        let decoded ;

        try {
            decoded = jwt.verify(token,process.env.JWT_SECRET);

            const user = await User.findById(decoded.userId);
            if(!user){
                throw new AppError("User not found",
                    401
                );
            };
            
            req.user = user ;

        } catch (error) {
            if (error.name === "JsonWebTokenError"){
                throw new AppError(
                    "Invalid token" ,
                    401
                );
            };
            if(error.name === "TokenExpiredError"){
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
