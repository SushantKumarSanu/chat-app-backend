import mongoose from "mongoose"

export const objectId = (value,helpers)=>{
    if(!mongoose.Schema.Types.ObjectId.isValid(value)){
        return helpers.message("Invalid Chat Id")
    };
    return value;
}