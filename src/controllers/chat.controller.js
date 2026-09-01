
import Chat from "../models/Chat.js";
import User from "../models/User.js"
import Message from "../models/Message.js";
import { accessChatSchema } from "../validators/chat.validator.js";
import {io} from "../server.js";
import AppError from "../errors/appError.js";


export const accessChat = async (req,res) => {
        const {error} = accessChatSchema.validate(req.body);
        if(error){
            throw new AppError(
                error.details[0].message.replace(/"/g, ""),
                400
            ); 
        } 
        const {userId} = req.body;
        let otherUser = await User.findById(userId);
        if(!otherUser){
            throw new AppError(
                "User not found",
                404
            );
            
        };
        if(userId===req.user._id.toString()){
            throw new AppError(
                "Cannot create chat with yourself",
                400
            ); 
        } 
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

}

export const fetchChats = async (req,res) =>{
        const chats = await Chat.find({
            users:{$in:[req.user._id]}
        })
        .populate("users","-password")
        .sort({updatedAt:-1})
        .lean();
        const chatIds = chats.map(chat=>chat._id);
        const modifiedChatlst= await Promise.all(
            chats.map(
                async(chat)=>{
                    const userId = req.user._id.toString();
                    if(chat?.lastMessage?.sender?.toString()===userId || 
                        chat?.lastMessage?.readBy?.some((id)=> id.toString()===userId)){
                            return {...chat,unreadCount:0}
                        }
                    let unreadCount ; 
                    const lastReadMessageId = chat.lastRead?.[userId];

                    if(!lastReadMessageId){    
                        unreadCount = await Message.countDocuments({
                        chat:chat._id,
                        sender:{$ne:req.user._id}
                        });
                        return{...chat,unreadCount}
                    }
                    const lastReadMessage = await Message.findById(lastReadMessageId).select("createdAt");
                    unreadCount = await Message.countDocuments({
                        chat:chat._id,
                        sender:{$ne:req.user._id},
                        createdAt:{$gt:lastReadMessage.createdAt}
                    });
                    return {...chat,unreadCount}
                }
                    
            )
        );
        const undeliveredMessages = await Message.find({
            chat:{ $in: chatIds },
            sender:{ $ne: req.user._id },
            deliveredTo: { $ne: req.user._id }
        });

        await Message.updateMany({
            _id:{$in:undeliveredMessages.map(m=>m._id)}
        },{
            $addToSet:{deliveredTo:req.user._id}
        });

        undeliveredMessages.forEach(msg => {
            io.to(msg.sender.toString()).emit("message recieved",{
                messageId:msg._id,
                user:req.user._id
            });
        });

        res.status(200).json(modifiedChatlst);

}