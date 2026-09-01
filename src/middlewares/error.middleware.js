import AppError from "../errors/appError.js";
import logger from "../logger/logger.js";


const errorMiddleware = (err, req, res, next)=>{
    if(res.headerSent){
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