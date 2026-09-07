import AppError from "../errors/AppError.js";
import logger from "../logger/logger.js";
import type { Request,Response,NextFunction } from "express";


const errorMiddleware = (err :Error, req:Request, res:Response, next:NextFunction)=>{
    if(res.headersSent){
        return next(err);
    };

    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            success:false,
            message:err.message
        });
    }
    logger.error(
        {
            err,
            method:req.method,
            url:req.originalUrl
        },
        "Unhandled server error"
    );
    return res.status(500).json({
        success:false,
        message:"Internal server error"
    });
};

export default errorMiddleware;