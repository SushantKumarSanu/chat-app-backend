import type { ObjectId } from "mongoose";
import type { Socket} from "socket.io"

const handleChat = (socket:Socket)=>{

    socket.on("join chat",(chatId:string)=>{

        if(!socket.userId||!chatId){
            console.log(!chatId ? "chatId is required" : "not authenticated");
            return;
        };

        socket.join(chatId);

        socket.emit("join chat");

        console.log(`User ${socket.userId} is connected to the chat ${chatId}`);

    });
};


export default handleChat;