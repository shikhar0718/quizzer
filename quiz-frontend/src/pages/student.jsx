import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import socket from "../socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Student() {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [players, setPlayers] = useState([]);

  const joinRoom = () => {
    if (!roomId || !name) return;

    socket.emit("joinRoom", { roomId, name });

    socket.roomId = roomId;
    socket.isHost = false;
  };

  useEffect(() => {

    socket.on("playersUpdate", ({ players }) => {
      setPlayers(players);
      setJoined(true);
    });

    socket.on("quizStarted", () => {
      navigate("/quiz");
    });

    socket.on("error", (msg) => {
      alert(msg);
    });

    return () => {
      socket.off("playersUpdate");
      socket.off("quizStarted");
      socket.off("error");
    };

  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      {!joined ? (

        <motion.div
          initial={{
            opacity:0,
            y:30
          }}

          animate={{
            opacity:1,
            y:0
          }}

          className="
          w-full
          max-w-md
          mx-auto
          flex
          flex-col
          items-center
          gap-6
          text-center
          "
        >

          <motion.h1
            animate={{
              y:[0,-3,0]
            }}

            transition={{
              repeat:Infinity,
              duration:2
            }}

            className="
            text-4xl
            font-bold
            "
          >
            Student Panel
          </motion.h1>

          <div className="w-full flex flex-col gap-4">

            <Input
              className="
              bg-zinc-900
              border-zinc-800
              focus:ring-2
              focus:ring-zinc-500
              transition-all
              "
              placeholder="Your Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />

            <Input
              className="
              bg-zinc-900
              border-zinc-800
              focus:ring-2
              focus:ring-zinc-500
              transition-all
              "
              placeholder="Room ID"
              value={roomId}
              onChange={(e)=>setRoomId(e.target.value)}
            />

            <motion.div
              whileHover={{
                scale:1.04
              }}

              whileTap={{
                scale:0.95
              }}
            >

              <Button
                onClick={joinRoom}

                className="
                w-full
                bg-white
                text-black
                hover:bg-zinc-300
                transition-all
                "
              >
                Join Quiz
              </Button>

            </motion.div>

          </div>

        </motion.div>

      ) : (

        <motion.div

          initial={{
            opacity:0
          }}

          animate={{
            opacity:1
          }}

          className="text-center"
        >

          <h2 className="text-3xl font-bold">
            Waiting for Quiz to Start...
          </h2>

          <p className="text-zinc-400 mt-2">
            Players in room:
          </p>

          <div className="mt-6 space-y-3">

            {players.map((p,i)=>(

              <motion.div
                key={i}

                whileHover={{
                  scale:1.03
                }}

                className="
                bg-zinc-900
                px-5
                py-3
                rounded-xl
                border
                border-zinc-800
                shadow-md
                "
              >

                {p.name} ({p.score})

              </motion.div>

            ))}

          </div>

        </motion.div>

      )}

    </div>
  );
}