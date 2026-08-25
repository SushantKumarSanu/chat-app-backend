import Joi from "joi"

 const changePasswordSchema = Joi.object({
    password:Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
    confirmPassword: Joi.string().required()
}) ;

export default changePasswordSchema;