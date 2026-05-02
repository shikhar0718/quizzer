import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Student() {
  const navigate = useNavigate();

  // 🔹 States
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [players, setPlayers] = useState([]);

  // 🔹 Join Room
  const joinRoom = () => {
    if (!roomId || !name) return;

    socket.emit("joinRoom", { roomId, name });

    // store for later use (important)
    socket.roomId = roomId;
  };

  // 🔹 Socket Listeners
  useEffect(() => {

    // players update → lobby show
    socket.on("playersUpdate", ({ players }) => {
      setPlayers(players);
      setJoined(true);
    });

    // quiz start → navigate to quiz page
    socket.on("quizStarted", () => {
      navigate("/quiz");
    });

    // optional: error handling
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center">

      {!joined ? (
        // 🔹 JOIN SCREEN
        <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 text-center">

          <h1 className="text-3xl font-bold">Student Panel</h1>

          <div className="w-full flex flex-col gap-4">

            <Input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />

            <Button onClick={joinRoom}>
              Join Quiz
            </Button>

          </div>
        </div>
      ) : (
        // 🔹 LOBBY SCREEN
        <div className="text-center">

          <h2 className="text-2xl font-bold">
            Waiting for Quiz to Start...
          </h2>

          <p className="text-zinc-400 mt-2">
            Players in room:
          </p>

          <div className="mt-4 space-y-2">
            {players.map((p, i) => (
              <div key={i} className="bg-zinc-800 px-4 py-2 rounded">
                {p.name} ({p.score})
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}