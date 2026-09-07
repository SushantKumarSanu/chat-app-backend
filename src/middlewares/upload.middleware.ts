import multer from "multer";
import AppError from "../errors/AppError.js";
import type { Request,Response,NextFunction } from "express";
import type { FileFilterCallback } from "multer";

const storage = multer.memoryStorage();


const fileFilter = (req:Request , file:Express.Multer.File , cb:FileFilterCallback) => {
    if(file.mimetype.startsWith("image/")){
        cb(null,true);
    }else{
         cb(new AppError("Only image files are allowed",400));
    }
};

const multerUpload = multer({
    storage,
    fileFilter,
    limits:{
        fileSize: 5 * 1024 * 1024
    }
});

const upload = (req:Request,res:Response,next:NextFunction)=>{
    multerUpload.single("avatar") (req , res , (error)=>{
        if(error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE"){
            return next( 
                new AppError(
                    "File size must be under 5 MB",
                    400
                )
        );  
        }
        if(error) return next(error);
        next();
    });
}


export default upload;

