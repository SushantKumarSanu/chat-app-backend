import {Server} from 'socket.io';


const setupSocket = (server)=>{
    const io = new Server(server,{
        cors:{
            origin:"*"
        }
    })
    return io;
};



export default setupSocket;
