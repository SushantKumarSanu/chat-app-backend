import multer from "multer";

const storage = multer.memoryStorage();


const fileFilter = (req , file , cb) => {
    if(file.mimetype.startsWith("image/")){
        cb(null,true);
    }else{
        cb(new Error("Only image files are allowed"),false);
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
        if(error){
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    next()
    });
}


export default upload;

