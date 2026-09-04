import AppError from "../errors/AppError.js";
import type { Request,Response,NextFunction } from "express";


const notFoundMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    next(
        new AppError(
            `Route not found :${req.method} ${req.originalUrl}`,
            404
        )
    );
};


export default notFoundMiddleware;
