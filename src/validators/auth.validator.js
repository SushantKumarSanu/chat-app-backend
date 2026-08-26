import Joi from "joi";


export const registerSchema = Joi.object({
    userName:Joi.string().min(4).max(30).trim().required(),
    email:Joi.string().email().trim().required(),
    password: Joi.string().min(8).required(),
    confirmPassword:Joi.string().required()
});


export const loginSchema = Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().required()
});