import bcrypt from "bcrypt"
import prisma from "../common/db/prisma.js";
import APIError from "../common/utils/api-error.js";
import { generateResetToken } from "../common/utils/jwt.utils.js";


const register = async ({name,email,password}) =>{
    const existingUser = await prisma.user.findUnique({
        where:{
            email
        }
    })
    if(existingUser){
        throw APIError.conflict("User with this email already exists")
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const {rawToken,hashedToken} = generateResetToken();


    const user = await prisma.user.create({
        data:{
        name:name,
        email:email,
        password:hashedPassword,
        verificationToken:hashedToken
        },

        select:{
            id:true,
            name:true,
            email:true,
            isVerified:true
        }
    });

    return {
        user,
        rawVerificationToken:rawToken
    }

    // send the username and rawToken in email to the user
};



export {register}