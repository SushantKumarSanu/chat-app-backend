import multer from "multer";
import AppError from "../errors/appError.js";

const storage = multer.memoryStorage();


const fileFilter = (req , file , cb) => {
    if(file.mimetype.startsWith("image/")){
        cb(null,true);
    }else{
        cb(new AppError("Only image files are allowed",400),false);
    }
};

const multerUpload = multer({
    storage,
    fileFilter,
    limits:{
        fileSize: 5 * 1024 * 1024
    }
});

const upload = (req,res,next)=>{
    multerUpload.single("avatar") (req , res , (error)=>{
    if(error) return next(error);
    next();
    });
}


export default upload;

