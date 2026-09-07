import mongoose from "mongoose";

interface IChat{
    isGroupChat:boolean,

    lastRead:Map<string,mongoose.Types.ObjectId>,

    users:mongoose.Types.ObjectId[],

    groupName?:string,

    groupAdmin?:string,

    lastMessage?:{
        messageId?:mongoose.Types.ObjectId,
        sender?:mongoose.Types.ObjectId,
        content?:string
    }
}


const chatSchema = new mongoose.Schema<IChat>({
    isGroupChat:{
        type:Boolean,
        default:false
    },
    lastRead:{
        type:Map,
        of:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message"
        }
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
        messageId:  {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message"
        },
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        content:{
            type:String
        },

    }    
},
{timestamps:true}
)


export default mongoose.model("Chat",chatSchema);