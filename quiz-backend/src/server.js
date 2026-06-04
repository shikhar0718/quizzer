import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import {Server} from "socket.io";
import cookieParser from "cookie-parser";


import initSocket from "./socket/index.js";
import prisma  from "./common/db/prisma.js";

import { authRouter} from '../src/auth/auth.route.js';


const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server,{
    cors:{origin:"*"}
});

const PORT = process.env.PORT || 5000;

initSocket(io);

async function testDB() {

    try {


        await prisma.$queryRaw`SELECT 1`;

        console.log("DB connected 🔥");

    }

    catch(err){

        console.log("DB ERROR");
        console.log(err);

    }

}

testDB();

app.get("/",(req,res)=>{
    res.send("Quizzer Backend is running");
});

app.use("/", authRouter);
server.listen(PORT,()=>{
    console.log(`Server is running on port: http://localhost:${PORT}`)
});