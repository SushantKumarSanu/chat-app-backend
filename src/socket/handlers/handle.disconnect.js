import User from "../../models/User.js";

const handleDisconnect = (socket,io)=>{

    socket.on("disconnect",async()=>{

        try{
            
            console.log("Socket disconnected :",socket.id);
            
            if(!socket.userId) return;
            
            const room = io.sockets.adapter.rooms.get(socket.userId);
            
            if(!room){
                await User.findByIdAndUpdate(socket.userId,{isOnline:false}).lean();
            
                socket.broadcast.emit("user offline",{user:socket.userId});
            };

        }catch(error){
            console.error("Disconnect error:",error);
        }
    });
};


export default handleDisconnect;