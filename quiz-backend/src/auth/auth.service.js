import bcrypt from "bcrypt"
import crypto from "crypto";
import prisma from "../common/db/prisma.js";
import APIError from "../common/utils/api-error.js";
import { generateAccessToken, generateRefreshToken, generateResetToken, verifyRefreshToken } from "../common/utils/jwt.utils.js";

//  helper function 
const hashToken = (token) =>{
   return crypto.createHash("sha256").update(token).digest("hex");
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
    // if(!existingUser.isVerified){
    //     throw APIError.forbidden ("Please verify your email first")
    // }

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

const refresh = async(token)=>{
    if(!token){
    
        throw APIError.unauthorized("Refresh token missing");
        const decoded = verifyRefreshToken(token);
        const user = await prisma.user.findUnique(
            {
                where:{
                    id:decoded.id
                },
                select:{
                    id:true,
                    name:true,
                    email:true,
                    refreshToken:true,
                    isVerified:true

                }
            }
        );
    }
    
    if(!user){
            throw APIError.notFound("User not found");
        }

        const hashedIncomingToken=hashToken(token);

        if(user.refreshToken!==hashedIncomingToken){
            throw APIError.unauthorized("Invalid refresh token");
        }
        
        const accessToken=generateAccessToken({
            id:user.id,
            email:user.email
        });
        
        const newRefreshToken=generateRefreshToken({
            id:user.id
        });

        await prisma.user.update({
            where:{
                id:user.id
            },
            data:{
            refreshToken:hashToken(newRefreshToken)
        }
    });

    return{

        accessToken,

        refreshToken:
        newRefreshToken

    };
}

const logout = async(userId)=>{
    await prisma.user.update({
        where:{
            id:userId
        },
        data:{
            refreshToken:null
        }
    })
}
  
const verification = async()=>{

}

const forgotPassword = async()=>{

}

const newPassword = async()=>{

}


export {register,login,refresh,logout,verification,forgotPassword,newPassword}