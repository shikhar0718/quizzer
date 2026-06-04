import joi from "joi";
import BaseDto from "../../common/dto/base.dto.js"


class RegisterDto extends BaseDto{
    static schema = joi.object(
        {
            name:joi
            .string()
            .trim()
            .min(2)
            .max(50)
            .required(),

            email:joi.
            string().
            email().
            lowercase().
            required(),

           password:joi
            .string()
            .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
            .message("password should be atleast of 8 charecters").required(),
        }   
    )
}

export default RegisterDto;