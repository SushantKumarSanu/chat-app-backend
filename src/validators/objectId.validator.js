import mongoose from "mongoose"

export const objectId = (value,helpers)=>{
    if(!mongoose.Types.ObjectId.isValid(value)){
        return helpers.message("Invalid Chat Id")
    };
    return value;
}