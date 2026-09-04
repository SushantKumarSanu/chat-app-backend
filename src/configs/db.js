import mongoose from "mongoose";
import logger from "../logger/logger.js";


const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        logger.info('Connected to database successfully')
    }catch(error){
        logger.error(
            {err:error},
            "MongoDB connection failed during startup"
        );
        process.exit(1);
    }
};

export default connectDB;