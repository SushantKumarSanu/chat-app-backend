import mongoose from "mongoose";
import { ref } from "process";

const messageSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat",
        required:true
    },
    messageType:{
        type:String,
        enum:["text","code"],
        default:"text"
    },
    content:{
        type:String,
        required:true,
        trim:true
    },
    deliveredTo:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    }]
},
{timestamps:true}
);

export default mongoose.model("Message",messageSchema);
