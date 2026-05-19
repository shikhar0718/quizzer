import bcrypt from "bcrypt"
import prisma from "../common/db/prisma.js";
import APIError from "../common/utils/api-error.js";
import { generateAccessToken, generateRefreshToken, generateResetToken } from "../common/utils/jwt.utils.js";

//  helper function 
const hashToken = (token) =>{
    crypto.createHash("sha256").update(rawToken).digest("hex");
}



// services
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
            password:true,
            isVerified:true,
        }
    });

    return {
        user,
        rawVerificationToken:rawToken
    }

    // send the username and rawToken in email to the user
};

const login= async ({email,password})=>{
    const existingUser = await prisma.user.findUnique({
        where:{
        email
        },

    select:{
        id:true,
        name:true,
        email:true,
        password:true,
        isVerified:true
    }
}
)
    if(!existingUser){
        throw APIError.notFound("You do not have an existing account")
    }
    const isPasswordCorrect = await bcrypt.compare(password,existingUser.password);


    if(!isPasswordCorrect){
        throw APIError.unauthorized("Invalid email id or password");

    }
    if(!existingUser.isVerified){
        throw APIError.forbidden ("Please verify your email first")
    }

    const accessToken = generateAccessToken({id:existingUser.id,email:existingUser.email});
    const refreshToken = generateRefreshToken({id:existingUser.id});

    await prisma.user.update({
        where:{
            id:existingUser.id
        },
        data:{
            refreshToken:hashToken(refreshToken)
        }
    });

//     try sending using cookies also 
    return {
        user:{
            id:existingUser.id,
            name:existingUser.name,
            email:existingUser.email,
            isVerified:existingUser.isVerified
        },
        accessToken,
        refreshToken,
    };

};

export {register,login}