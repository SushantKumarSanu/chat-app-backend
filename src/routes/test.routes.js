import  express from 'express';


const router =  express.Router();


router.get("/",(req,res)=>{
    throw new Error("Test Error");
});


export default router;
