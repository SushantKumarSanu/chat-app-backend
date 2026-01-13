import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    isGroupChat:{
        type:Boolean,
        default:false
    },
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    groupName:{
        type:String,
        trim:true,
        required:function(){
            return this.isGroupChat;
        }
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    lastMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    }
},
{timestamps:true}
)


export default mongoose.model("Chat",chatSchema);