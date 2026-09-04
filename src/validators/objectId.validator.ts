import mongoose from "mongoose";
import { type CustomHelpers } from "joi";

export const objectId = ( value: string , helpers:CustomHelpers )=>{
    if(!mongoose.Types.ObjectId.isValid(value)){  
        return helpers.message({
            custom:"Invalid Chat Id"
        });
    };
    return value;
};