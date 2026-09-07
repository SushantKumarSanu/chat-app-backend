import mongoose from "mongoose";
import logger from "../logger/logger.js";


const connectDB = async ()=>{
    try{
        const mongoUrl = process.env.MONGO_URI;
        if(!mongoUrl){
            logger.error("MongoDb URL is missing");
            return;
        }
        await mongoose.connect(mongoUrl);
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