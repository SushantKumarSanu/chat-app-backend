import {Server} from 'socket.io';
import type { Server as HttpServer } from 'node:http';

const setupSocket = (server:HttpServer)=>{
    const io = new Server(server,{
        cors:{
            origin:"*"
        }
    })
    return io;
};



export default setupSocket;
