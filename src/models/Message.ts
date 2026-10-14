import mongoose from "mongoose";
import type { HydratedDocument } from "mongoose";

interface IMessage {
    deletedFor:mongoose.Types.ObjectId[],

    sender:mongoose.Types.ObjectId,

    chat:mongoose.Types.ObjectId,

    messageType:"text"|"code",

    content:string,

    deliveredTo:mongoose.Types.ObjectId[],

    createdAt:Date,

    updatedAt:Date,
}

type MessageDocument = HydratedDocument<IMessage>;



const messageSchema = new mongoose.Schema<IMessage>({
    deletedFor:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[]
    }],
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

export type {MessageDocument};

export default mongoose.model("Message",messageSchema);
