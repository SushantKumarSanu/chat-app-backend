import User from "../models/User.js";


export const searchUsers = async(req,res)=>{
    try{
    const {query} = req.query;
    if(!query) return res.status(400).json({message:"Need email"});
    const users = await User.find({
        _id:{$ne:req.user._id},
        email:{$regex:query,$options:"i"}
    })
    .select("_id username email ")
    .limit(5);
    res.status(200).json({
        result:users
    });
}catch(error){
    console.log(error)
    res.status(500).json({message:"Internal server error"});
}
};
