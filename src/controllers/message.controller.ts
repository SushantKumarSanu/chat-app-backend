import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import {io} from "../server.js";
import { fetchMessageSchema, sendMessageSchema,messageId } from "../validators/message.validator.js";
import AppError from "../errors/AppError.js";
import type { Request,Response } from "express";
import mongoose from "mongoose";


export const sendMessage = async (req:Request,res:Response) =>{
    
    const {error} = sendMessageSchema.validate(req.body);
    if(error){
        throw new AppError(
            error.details[0]?.message?.replace(/"/g, "")?? "Invalid request",
            400
        );
            
    }
    const {chatId,content,messageType} = req.body;
    let message = await Message.create({
        sender:req.user._id,
        chat:chatId,
        content,
        messageType:messageType||"text"
    })
    message = await message.populate("sender","username email avatar");
    const chat = await Chat.findByIdAndUpdate(
        chatId,{
            $set:{
                "lastMessage.messageId":message._id,
                "lastMessage.content":message.content,
                "lastMessage.sender":req.user._id,
            }
        },{new:true}
    ).lean();
    io.to(chatId).emit("new message",{message,chat});
    res.status(201).json(message);
}


export const fetchMessages = async(req:Request,res:Response) =>{
        const {error,value} = fetchMessageSchema.validate({
            chatId:req.params.chatId,
            page:req.query.page,
            limit:req.query.limit
        },{convert:true}) ;



        if(error){
            throw new AppError(
                error.details[0]?.message?.replace(/"/g, "")?? "Invalid request",
                400
            );            
        }  
        const {chatId,page,limit} = value;
        const chat = await Chat.findById(chatId).populate("lastMessage.messageId");
        if (!chat) {
            throw new AppError( "Chat not found" ,
                404
            );
        };

        if (!chat.users.some(id => id.toString() === req.user._id.toString())) {
            throw new AppError("Unauthorized",
                403
            );            
        }
        let lastChatDeletedDate;
        if(chat.deletedAt?.get(req.user._id.toString())){
            lastChatDeletedDate =  chat.deletedAt.get(req.user._id.toString());
        };

        const lastMessage = chat.lastMessage?.messageId;

        if(lastMessage&&!(lastMessage instanceof mongoose.Types.ObjectId)){

        if(lastMessage._id && chat.lastMessage?.sender?.toString() !== req.user._id.toString() &&
        lastChatDeletedDate && lastMessage.createdAt>lastChatDeletedDate) {
             if (!chat.lastRead) {
                chat.lastRead = new Map();
            }

            chat.lastRead.set(
                req.user._id.toString(),
                lastMessage._id 
            );
            await chat.save();
        }

    }
        const skip = (page - 1)*limit;
        const messageFilter :{
            chat:mongoose.Types.ObjectId,
            deletedFor:{$ne:mongoose.Types.ObjectId},
            createdAt?:{$gt:Date}
        } = {
            chat:chatId,
            deletedFor:{$ne:req.user._id}
        };
        if(lastChatDeletedDate){
            messageFilter.createdAt = {$gt:lastChatDeletedDate};
        };
        const messages = await Message.find(messageFilter)
        .populate("sender","username avatar email")
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        if(chat.lastMessage?.sender){
        io.to(chat.lastMessage.sender.toString()).emit("message read",{updatedChat:chat});
        };

        
        res.status(200).json(messages);

};


export const deleteMessage = async(req:Request,res:Response)=>{
    const {error,value} = messageId.validate({
        messageId:req.params.messageId
    });
    if(error){
        throw new AppError(error.details[0]?.message?.replace(/"/g, "")?? "Invalid request",400);
    }

    const existingMessage = await Message.findById(value.messageId);

    if(!existingMessage){
        throw new AppError("Message doen't exists",404)
    };

    const chat = await Chat.findOne({_id:existingMessage.chat,users:req.user._id});
    if(!chat){
        throw new AppError("You are not authorized to delete this message",403);
    };

    if(existingMessage.deletedFor.some(id=>id.equals(req.user._id))){
        throw new AppError("This message was already deleted",400)
    };

    existingMessage.deletedFor.push(req.user._id);
    await existingMessage.save();
    res.status(200).json({success:true,message:'Message deleted successfully'})

};