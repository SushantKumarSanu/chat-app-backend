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

io.on("connection",(socket)=>{
    console.log("Socket connected:",socket.id);
    socket.on("setup",async(token)=>{
        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            socket.userId = decoded.userId;
            socket.join(socket.userId);
            await User.findByIdAndUpdate(socket.userId,{isOnline:true});
            socket.emit("connected");
            socket.broadcast.emit("user online",socket.userId);
            console.log("User Authenticated :",socket.userId);
        }catch(error){
            console.log("Socket auth failed");
            socket.disconnect();
        }
    });
    socket.on("join chat",(chatId)=>{
        if(!socket.userId||!chatId){
            console.log(!chatId ? "chatId is required" : "not authenticated");
            return;
        };
        socket.join(chatId);
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
        console.log("Socket disconnected :",socket.id);
        if(!socket.userId) return;
        await User.findByIdAndUpdate(socket.userId,{isOnline:false});
        socket.broadcast.emit("user offline",socket.userId);
    });
});


server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});



export {io};