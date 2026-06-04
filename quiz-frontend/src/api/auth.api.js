import axios from "axios";

const api = axios.create({

    baseURL:"http://localhost:5000",

    withCredentials:true

});


export const registerUser = (data)=>{

    return api.post(
        "/register",
        data
    );

};


export const loginUser = (data)=>{

    return api.post(
        "/login",
        data
    );

};