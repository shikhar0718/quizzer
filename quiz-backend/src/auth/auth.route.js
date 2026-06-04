import {Router} from "express";
import * as controller from "./auth.controller.js";
import validate from "../common/middleware/validator.js";
import RegisterDto from "./dto/register.dto.js";
import LoginDto from "./dto/login.dto.js";

const authRouter = Router();

authRouter.post("/register",validate(RegisterDto), controller.register);
authRouter.post("/login",validate(LoginDto),controller.login);

export {authRouter};