import * as authService from "./auth.service.js"
import APIResponse from "../common/utils/api-response.js"


const register = async (req,res,next) =>{
    // /routing
    try{
        const user = await authService.register(req.body);
        APIResponse.created(res,"Registration successful",user);
    }

    catch(err){
        next(err);
    }
};

const login  = async(req,res , next)=>{
    try{
        const {user,accessToken,refreshToken} = await authService.login(req.body);

        res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  APIResponse.ok(res,"Login Successful",{user,accessToken})
    }
    catch(err){
        next(err);
    }
};

const refresh =async(req,res,next)=>{

}
const logout =async(req,res,next)=>{

} 


export {register,login,refresh,logout} 
