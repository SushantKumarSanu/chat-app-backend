import Joi from "joi";

export const userNameSchema = Joi.object({
    userName:Joi.string().min(4).max(30).trim().required()
});

