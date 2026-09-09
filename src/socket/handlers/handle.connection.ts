import handleDisconnect  from "./handle.disconnect.js";
import handleChat from "./handle.chat.js";
import { handleUserTyping , handleStopTyping  } from "./handle.typing.js";
import { handleMessageRead , handleMessageRecieved} from "./handle.message.js";
import type { Socket,Server } from "socket.io";



const handleSocketConnection = (socket:Socket,io:Server)=>{   
    console.log("Socket connected:",socket.id);

    if(socket.userId){
        socket.broadcast.emit("user online",{user:socket.userId});

        socket.join(socket.userId);

        console.log(`Joined the personal room of name ${socket.userId}`);
    }

    socket.emit("connected");

    handleChat(socket);

    handleMessageRead(socket);
    handleMessageRecieved(socket);

    handleUserTyping(socket);
    handleStopTyping(socket);

    handleDisconnect(socket,io);


};



export default handleSocketConnection;