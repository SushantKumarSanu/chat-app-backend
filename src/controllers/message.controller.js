import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import {io} from "../server.js";
import { fetchMessageSchema, sendMessageSchema } from "../validators/message.validator.js";
import AppError from "../errors/appError.js";


export const sendMessage = async (req,res) =>{
    
    const {error} = sendMessageSchema.validate(req.body);
    if(error){
        throw new AppError(
            error.details[0].message.replace(/"/g, ""),
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


export const fetchMessages = async(req,res) =>{
        const {error,value} = fetchMessageSchema.validate({
            chatId:req.params.chatId,
            page:req.query.page,
            limit:req.query.limit
        },{convert:true}) ;



        if(error){
            throw new AppError(
                error.details[0].message.replace(/"/g, ""),
                400
            );            
        }  
        const {chatId,page,limit} = value;
        const chat = await Chat.findById(chatId);

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

        if(chat.lastMessage && chat.lastMessage.sender?.toString() !== req.user._id.toString()) {
            chat.lastRead.set(
                req.user._id.toString(),
                chat.lastMessage.messageId
            );
            await chat.save();
        }
        const skip = (page - 1)*limit;
        const messages = await Message.find({chat:chatId})
        .populate("sender","username avatar email")
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        if(chat.lastMessage?.sender){
        io.to(chat.lastMessage.sender.toString()).emit("message read",{updatedChat:chat});
        }
        res.status(200).json(messages);

};
