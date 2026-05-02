import { useState, useEffect } from "react";
import socket from "../socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Teacher() {
  const [roomId, setRoomId] = useState("");

  // question states
  const [question,setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  const [questions, setQuestions] = useState([]);


  const createRoom = () => {
    socket.emit("createRoom"); // 🔥 no input needed
  };

  const startQuiz = () => {
    if (!roomId) return;
    socket.emit("quizStart", { roomId });
  };

  const addQuestion =()=>{
    if(!question || options.includes("")){
      return;
    }

    const newQ ={
      question,
      options,
      correctAnswer:correct
    };

    setQuestions([...questions, newQ]);

    // reset inputs
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrect(0);
  }

  // submit questions to the backend
  const submitQuestions =()=>{
    if(!roomId || questions.length === 0){
      return;
    }
    socket.emit("setQuestions", {
      roomId,
      questions
    });
  }

  useEffect(() => {
    socket.on("roomCreated", ({ roomId }) => {
      console.log("Room created", roomId);
      setRoomId(roomId);
    });

    socket.on("questionsSet", ()=>{
      alert("Questions uploaded successfully !");
    });



    return () => {
      socket.off("roomCreated");
      socket.off("questionsSet")
    };
  }, []);

    return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="w-full max-w-md mx-auto flex flex-col gap-6 text-center">

        <h1 className="text-3xl font-bold">Teacher Panel</h1>

        {/* Create Room */}
        <Button onClick={createRoom}>
          Create Room
        </Button>

        {/* Show Room ID */}
        {roomId && (
          <div className="bg-zinc-900 p-4 rounded-lg">
            <p className="text-zinc-400 text-sm">Room ID</p>
            <h2 className="text-2xl font-bold tracking-widest">{roomId}</h2>
          </div>
        )}

        {/* 🔥 QUESTION BUILDER */}
        {roomId && (
          <div className="flex flex-col gap-3">

            <Input
              placeholder="Enter Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            {options.map((opt, i) => (
              <Input
                key={i}
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => {
                  const newOpts = [...options];
                  newOpts[i] = e.target.value;
                  setOptions(newOpts);
                }}
              />
            ))}

            <Input
              type="number"
              placeholder="Correct Answer (0-3)"
              value={correct}
              onChange={(e) => setCorrect(Number(e.target.value))}
            />

            <Button onClick={addQuestion}>
              Add Question
            </Button>

            {/* Preview */}
            <div className="text-left">
              <p className="text-zinc-400 text-sm">
                Questions Added: {questions.length}
              </p>
            </div>

            <Button onClick={submitQuestions}>
              Submit Questions
            </Button>

          </div>
        )}

        {/* Start Quiz */}
        <Button
          variant="secondary"
          onClick={startQuiz}
          disabled={!roomId}
        >
          Start Quiz
        </Button>

      </div>
    </div>
  );
}