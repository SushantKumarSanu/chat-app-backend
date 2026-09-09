import "dotenv/config";
// import dotenv from 'dotenv';
// dotenv.config();


import http from 'http';
import app from './app.js';
import connectDB from './configs/db.js';
import setupSocket from "./socket/index.js";
import authMiddleware from "./socket/middlewares/auth.middleware.js";
import handleSocketConnection from "./socket/handlers/handle.connection.js";

connectDB();

const server = http.createServer(app);
const PORT = process.env.PORT || 5000 ;


const io = setupSocket(server);


io.use(authMiddleware);


io.on("connection",(socket)=>{handleSocketConnection(socket,io)});


server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});



export {io};