import Joi from "joi";
import { objectId } from "./objectId.validator.js";

export const sendMessageSchema = Joi.object({
    content:Joi.string().trim().min(1).max(500).required(),
    chatId:Joi.string().required().custom(objectId)
});


export const fetchMessageSchema = Joi.object({
    chatId:Joi.string().required().custom(objectId),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20)   
}); 