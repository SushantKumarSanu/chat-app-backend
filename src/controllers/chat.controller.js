import { isObjectIdOrHexString } from "mongoose";
import Chat from "../models/Chat.js";
import User from "../models/User.js"
import Message from "../models/Message.js";
import { accessChatSchema } from "../validators/chat.validator.js";
import {io} from "../server.js";


export const accessChat = async (req,res) => {
    try{
        const {error} = accessChatSchema.validate(req.body);
        if(error) return res.status(400).json({message:error.details[0].message.replace(/"/g, "")})
        const {userId} = req.body;
        let otherUser = await User.findById(userId);
        if(!otherUser) return res.status(404).json({message:"User not found"});
        if(userId===req.user._id.toString()) return res.status(400).json({message:"Cannot create chat with yourself"}) ;
        let chat = await Chat.findOne({
            isGroupChat:false,
            users:{$all:[req.user._id,userId]}
        })
        .populate("users","-password")
        if(chat){
            return res.status(200).json(chat);
        }
        const newChat = await Chat.create({
            users:[req.user._id,userId],
            isGroupChat:false
        });

        const fullChat = await Chat.findById(newChat._id)
        .populate("users","-password");

        res.status(201).json(fullChat);
    }catch(error){
        console.error("ACCESS CHAT ERROR:", error);
        res.status(500).json({message: "Server error"});
    }
}

export const fetchChats = async (req,res) =>{
    try{
        const chats = await Chat.find({
            users:{$in:[req.user._id]}
        })
        .populate("users","-password")
        .sort({updatedAt:-1});
        const chatIds = chats.map(chat=>chat._id);
        const undeliveredMessages = await Message.find({
            chat:{ $in: chatIds },
            sender:{ $ne: req.user._id },
            deliveredTo: { $ne: req.user._id }
        })
        const messages = await Message.updateMany({
            _id:{$in:undeliveredMessages.map(m=>m._id)}
        },{
            $addToSet:{deliveredTo:req.user._id}
        });
        undeliveredMessages.forEach(msg => {
            io.to(msg.sender.toString()).emit("message recieved",{
                message:msg._id,
                user:req.user._id
            });
        });
        res.status(200).json(chats);
    }catch(error){
        res.status(500).json({ message: "Server error" });
    }
}