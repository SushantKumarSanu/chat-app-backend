import mongoose, { type HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";



interface IUser{

  username:string,

  email:string,

  password:string,

  avatar:{
    public_id:string,
    secure_url:string
  },

  isOnline:boolean

};

type UserDocument = HydratedDocument<IUser>;

const userSchema =new mongoose.Schema<IUser>({  
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, 
    },
    avatar: {
      public_id:{
        type: String,
        default: "",
    },
    secure_url:{
        type:String,
        default:"",
    }
  },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
});



userSchema.pre('save',async function(){
    if(!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);

})


userSchema.methods.comparePassword = async function (enteredPassword:string){
    return await bcrypt.compare(enteredPassword,this.password);
}
export type {IUser , UserDocument};
export default mongoose.model('User',userSchema);