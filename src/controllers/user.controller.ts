import type { Request , Response } from "express";
import AppError from "../errors/AppError.js";
import User from "../models/User.js";


export const searchUsers = async(req:Request,res:Response)=>{

    const {query} = req.query;

    if(!query){
        throw new AppError(
            "Need email",
            400
        )
    }

    const users = await User.find({
        _id:{$ne:req.user._id},
        email:{$regex:query,$options:"i"}
    })
    .select("_id username email ")
    .limit(5);

    res.status(200).json({
        result:users
    });


};
