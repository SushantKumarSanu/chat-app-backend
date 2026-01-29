import Chat from "../models/Chat.js";

export const accessChat = async (req,res) => {
    try{
        const {userId} = req.body;
        if(!userId){
            return res.status(400).json({message:"UserId is required"});
        }
        let chat = await Chat.findOne({
            isGroupChat:false,
            users:{$all:[req.user._id,userId]}
        })
        .populate("users","-password")
        .populate("lastMessage");
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
        .populate("lastMessage")
        .sort({updatedAt:-1});
        res.status(200).json(chats);
    }catch(error){
        res.status(500).json({ message: "Server error" });
    }
}