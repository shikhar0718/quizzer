import express from "express";
import http from "http";
import cors from "cors";
import {Server} from "socket.io";
import dotenv from "dotenv";
dotenv.config();


import initSocket from "./socket/index.js";


const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server,{
    cors:{origin:"*"}
});

const PORT = process.env.PORT || 5000;

initSocket(io);

app.get("/",(req,res)=>{
    res.send("Quizzer Backend is running");
});

server.listen(PORT,()=>{
    console.log(`Server is running on port: http://localhost:${PORT}`)
})