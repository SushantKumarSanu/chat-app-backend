import type { Socket } from "socket.io";
import logger from "../../logger/logger.js";
import SocketError from "./SocketError.js";


const handleSocketError = ({socket,error,context}:{socket:Socket,error:Error,context: Record<string, unknown>;})=>{
    if(error instanceof SocketError){
        socket.emit("socket error",{
            success:false,
            code:error.code,
            message:error.message
        });
        return;
    };
    logger.error(
        {
            err:error,
            socketId:socket.id,
            ...context
        },
        "Unhandled Socket error"
    );
    socket.emit("socket_error",{
        success:false,
        code:"INTERNAL_ERROR",
        message:"Something went wrong"
    });
};


export default handleSocketError;


