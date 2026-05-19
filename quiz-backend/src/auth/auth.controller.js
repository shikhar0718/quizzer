import * as authService from "./auth.service.js"
import APIResponse from "../common/utils/api-response.js"


const register = async (erq,res,next) =>{
    // /routing
    try{
        const user =
        await authService.register(req.body);
        APIResponse.created(res,"Registration successful",user);
    }

    catch(err){
        next(err);
    }
};


export {register} 
