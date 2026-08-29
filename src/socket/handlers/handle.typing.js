

export const handleUserTyping = (socket)=>{
    socket.on("typing",(chatId)=>{
        
        if(!chatId || !socket.userId) return;
        
        socket.to(chatId).emit("typing",{chatId,user:socket.userId});
    });

}


export const handleStopTyping = (socket) =>{

    socket.on("stop typing",(chatId)=>{

        if(!chatId || !socket.userId) return;

        socket.to(chatId).emit("stop typing",{chatId,user:socket.userId});
    });

}