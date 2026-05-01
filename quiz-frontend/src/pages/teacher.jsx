import { useState } from "react";
import socket from "../socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Teacher() {
  const [roomId, setRoomId] = useState("");

  const createRoom = () => {
    if (!roomId) return;
    socket.emit("createRoom", { roomId });
  };

  const startQuiz = () => {
    if (!roomId) return;
    socket.emit("quizStart", { roomId });
  };

  return (
    <div className="min-h-screen w-screen bg-black text-white flex items-center justify-center">

      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 text-center">

        <h1 className="text-3xl font-bold">Teacher Panel 🎓</h1>

        <div className="w-full flex flex-col gap-4">
          <Input
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />

          <Button onClick={createRoom}>
            Create Room
          </Button>

          <Button variant="secondary" onClick={startQuiz}>
            Start Quiz
          </Button>
        </div>

      </div>
    </div>
  );
}