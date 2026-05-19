import crypto from "crypto";
import jwt from "jsonwebtoken";

const generateAccessToken=(payload)=>{
    jwt.sign(payload,process.env.JWT_ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m",
        algorithm:"HS512",
    })

}

const generateRefreshToken=(payload)=>{
    jwt.sign(payload,process.env.JWT_REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "24h",
        algorithm:"HS512",
    })
}

const verifyAccessToken=(token)=>{
    return jwt.sign(payload,process.env.JWT_ACCESS_TOKEN_SECRET,)
}

const verifyRefreshToken = (token) =>{
    return jwt.verify(payload,process.env.JWT_REFRESH_TOKEN_SECRET)
}

const generateResetToken=()=>{
    const rawToken = crypto
    .randomBytes(32)
    .toString("hex");


    const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex")

    return {rawToken,hashedToken}
}

export {
    generateResetToken,
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}