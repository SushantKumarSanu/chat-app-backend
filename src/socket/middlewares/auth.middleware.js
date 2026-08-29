import jwt from 'jsonwebtoken';
import User from '../../models/User.js';




const authMiddleware = async(socket,next)=>{
    try{
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error("No token provided"));
        };
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        await User.findByIdAndUpdate(socket.userId,{isOnline:true});
        next();
    }catch{
        next(new Error("Not authenticated")); 
    };

};


export default authMiddleware;