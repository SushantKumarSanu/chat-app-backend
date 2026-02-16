import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import {Server} from 'socket.io';
import app from './app.js';
import User from './models/User.js';
import connectDB from './configs/db.js';
import jwt from 'jsonwebtoken';

connectDB();

const server = http.createServer(app);
const PORT = process.env.PORT || 5000 ;
const io = new Server(server,{
    cors:{
        origin:"*"
    }
});



io.use(async(socket,next)=>{
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

});

io.on("connection",(socket)=>{
    console.log("Socket connected:",socket.id);
    if(socket.userId){
        socket.join(socket.userId);
        console.log(`Joined the personal room of name ${socket.userId}`);
    }
    socket.emit("connected");
    socket.on("join chat",(chatId)=>{
        if(!socket.userId||!chatId){
            console.log(!chatId ? "chatId is required" : "not authenticated");
            return;
        };
        socket.join(chatId);
        socket.emit("join chat");
        console.log(`User ${socket.userId} is connected to the chat ${chatId}`);

    });
    socket.on("typing",(chatId)=>{
        if(!chatId || !socket.userId) return;
        
        socket.to(chatId).emit("typing",{chatId,user:socket.userId});
    });
    socket.on("stop typing",(chatId)=>{
          if(!chatId || !socket.userId) return;
        socket.to(chatId).emit("stop typing",{chatId,user:socket.userId});
    });
    socket.on("disconnect",async()=>{
        try{
        console.log("Socket disconnected :",socket.id);
        if(!socket.userId) return;
        const room = io.sockets.adapter.rooms.get(socket.userId);
        if(!room){
            await User.findByIdAndUpdate(socket.userId,{isOnline:false}).lean();
            socket.broadcast.emit("user offline",socket.userId);
        };
        }catch(error){
            console.error("Disconnect error:",error);
        }
    });
});


server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});



export {io};