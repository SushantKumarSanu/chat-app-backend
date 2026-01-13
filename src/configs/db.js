import mongoose from "mongoose";


const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('connected database successfully')
    }catch(error){
        console.error('Mongodb connection failed');
        process.exit(1);
    }
};

export default connectDB;