import crypto from "crypto";

const generateAccessTokenSecret = crypto
                                .randomBytes(32)
                                .toString("hex");

const generateRefreshTokenSecret = crypto
                                .randomBytes(32)
                                .toString("hex")


console.log(generateAccessTokenSecret);
console.log(generateRefreshTokenSecret);