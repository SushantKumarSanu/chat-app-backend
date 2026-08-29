import User from "../../models/User.js";
import Message from "../../models/Message.js";
import Chat from "../../models/Chat.js";


export const handleMessageRecieved = (socket) =>{

    socket.on("message recieved",async ({message,user})=>{
        if(!user||!message) return;
    
        const foundUser = await User.findById(user);

        if(!foundUser) return;


        const foundMessage = await Message.findByIdAndUpdate(message,{deliveredTo:[foundUser._id]});
    
        if(!foundMessage) return ;

        socket.to(String(foundMessage.sender._id)).emit("message recieved",{messageId:message,user:foundUser._id});
    });

};


export const handleMessageRead = (socket)=>{

    socket.on("message read",async({message,user})=>{

        if(!message||!user) return;

        const foundUser = await User.findById(message.sender);

        if(!foundUser) return;

        const foundChat = await Chat.findOneAndUpdate({
            _id:message.chat,
            "lastMessage.messageId":message._id,
            "lastMessage.sender":{$ne:user}},
            {$set:{[`lastRead.${user}`]:message._id}},
            {new:true});

        console.log(foundChat);

        if(!foundChat) return ;

        socket.to(foundChat.lastMessage.sender.toString()).emit("message read",{updatedChat:foundChat});
    });

};