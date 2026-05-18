import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import {Server} from "socket.io";



import initSocket from "./socket/index.js";
import prisma  from "./common/db/prisma.js";


const app = express();
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

        const users =
        await prisma.user.findMany();

        console.log("DB connected 🔥");
        console.log(users);

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

server.listen(PORT,()=>{
    console.log(`Server is running on port: http://localhost:${PORT}`)
});