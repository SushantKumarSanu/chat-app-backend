import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import {io} from "../server.js";


export const sendMessage = async (req,res) =>{
    try{
        const {chatId,content,messageType} = req.body;
        if(!chatId||!content){
            return res.status(400).json({message:"Chatid and content is required"});
        }
        let message = await Message.create({
            sender:req.user._id,
            chat:chatId,
            content,
            messageType:messageType||"text"
        })
        message = await message.populate("sender","username email avatar");
        const chat = await Chat.findByIdAndUpdate(chatId,{$set:{"lastMessage.messageId":message._id,"lastMessage.content":message.content,"lastMessage.sender":req.user._id,"lastMessage.readBy":[]}}).lean();
        console.log(chat)
        io.to(chatId).emit("new message",message);
        res.status(201).json(message);
    }catch(error){
        res.status(500).json({ message: "Server error" });

    }
}

export const fetchMessages = async(req,res) =>{
    try{
        const {chatId} = req.params
        if(!chatId){
            return res.status(400).json({message:"Chatid is required"});
        };
        const chat = await Chat.findOneAndUpdate({_id:chatId,"lastMessage.sender":{$ne:req.user._id}}
        ,{$addToSet:{"lastMessage.readBy":req.user._id}},{new:true});
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 20 
        const skip = (page - 1)*limit;
        const messages = await Message.find({chat:chatId})
        .populate("sender","username avatar email")
        .populate("chat")
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        if(chat){
        console.log("hellow2")
        io.to(chat.lastMessage.sender.toString()).emit("message read",{updatedChat:chat});
        }
        res.status(200).json(messages);
    }catch(error){
        res.status(500).json({message:"server side error"});
    };
};
