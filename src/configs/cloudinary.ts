import { v2 as cloudinary } from "cloudinary" ;


const cloudName =  process.env.CLOUDINARY_CLOUD_NAME;
const cloudKey = process.env.CLOUDINARY_API_KEY;
const cloudSecret = process.env.CLOUDINARY_API_SECRET;

if(!cloudName||!cloudSecret||!cloudKey){
    throw new Error("Cloud Secrets are not configured");
}

cloudinary.config({
    cloud_name: cloudName,
    api_key:cloudKey,
    api_secret:cloudSecret
});


export default cloudinary;