import Joi from "joi";
import { objectId } from "./objectId.validator.js";

export const accessChatSchema = Joi.object({
    userId:Joi.string().required().custom(objectId)
});

