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

const login = async(req,res,next) =>{
    try{
        const user= await authService.login(req.body);
        APIResponse.ok(res,"Login successful", user)

    }

    catch(err){
        next(err);
    }
};


export {register,login} 
