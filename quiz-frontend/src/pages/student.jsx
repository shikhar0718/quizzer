import { useState } from "react";
import socket from "../socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Student() {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");

  const joinRoom = () => {
    if (!roomId || !name) return;
    socket.emit("joinRoom", { roomId, name });
  };

  return (
    <div className="min-h-screen w-screen bg-black text-white flex items-center justify-center">

      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 text-center">

        <h1 className="text-3xl font-bold">Student Panel 🧑‍🎓</h1>

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
    </div>
  );
}