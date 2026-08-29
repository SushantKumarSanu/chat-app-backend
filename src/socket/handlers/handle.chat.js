

const handleChat = (socket)=>{

    socket.on("join chat",(chatId)=>{

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