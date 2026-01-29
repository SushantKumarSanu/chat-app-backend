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
        await Chat.findByIdAndUpdate(chatId,{lastMessage:message._id});
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
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 20 
        const skip = (page - 1)*limit;
        const messages = await Message.find({chat:chatId})
        .populate("sender","username avatar email")
        .populate("chat")
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        res.status(200).json(messages);

    }catch(error){
        res.status(500).json({message:"server side error"});
    };
};
