import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import socket from "../socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Teacher() {
  const [roomId, setRoomId] = useState("");

  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  const [questions, setQuestions] = useState([]);

  const createRoom = () => {
    socket.emit("createRoom");
  };

  const startQuiz = () => {
    if (!roomId) return;
    socket.emit("quizStart", { roomId });
  };

  const addQuestion = () => {
    if (!question || options.includes("")) return;

    const newQ = {
      question,
      options,
      correctAnswer: correct,
    };

    setQuestions([...questions, newQ]);

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrect(0);
  };

  const submitQuestions = () => {
    if (!roomId || questions.length === 0) return;

    socket.emit("setQuestions", {
      roomId,
      questions,
    });
  };

  useEffect(() => {
    socket.on("roomCreated", ({ roomId }) => {
      setRoomId(roomId);

      socket.roomId = roomId;
      socket.isHost = true;
    });

    socket.on("questionsSet", () => {
      alert("Questions uploaded successfully!");
    });

    socket.on("quizStarted", () => {
      navigate("/quiz");
    });

    return () => {
      socket.off("roomCreated");
      socket.off("questionsSet");
      socket.off("quizStarted");
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

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
          Teacher Panel
        </motion.h1>


        <motion.div
          whileHover={{scale:1.04}}
          whileTap={{scale:0.95}}
        >

          <Button
            onClick={createRoom}
            className="w-full"
          >
            Create Room
          </Button>

        </motion.div>


        {roomId && (

          <motion.div

            whileHover={{
              scale:1.02
            }}

            className="
            bg-zinc-900
            p-4
            rounded-xl
            border
            border-zinc-800
            "
          >

            <p className="text-zinc-400 text-sm">
              Room ID
            </p>

            <h2 className="
            text-2xl
            font-bold
            tracking-widest
            ">
              {roomId}
            </h2>

          </motion.div>

        )}


        {roomId && (

          <div className="flex flex-col gap-3">

            <Input
              className="
              bg-zinc-900
              border-zinc-800
              focus:ring-2
              focus:ring-zinc-500
              "
              placeholder="Enter Question"
              value={question}
              onChange={(e)=>setQuestion(e.target.value)}
            />

            {options.map((opt,i)=>(

              <Input
                key={i}
                className="
                bg-zinc-900
                border-zinc-800
                focus:ring-2
                focus:ring-zinc-500
                "
                placeholder={`Option ${i+1}`}
                value={opt}
                onChange={(e)=>{

                  const newOpts=[...options];
                  newOpts[i]=e.target.value;
                  setOptions(newOpts);

                }}
              />

            ))}

            <Input
              className="
              bg-zinc-900
              border-zinc-800
              focus:ring-2
              focus:ring-zinc-500
              "
              type="number"
              placeholder="Correct Answer (0-3)"
              value={correct}
              onChange={(e)=>
                setCorrect(Number(e.target.value))
              }
            />


            <motion.div
              whileHover={{scale:1.04}}
              whileTap={{scale:0.95}}
            >

              <Button
                onClick={addQuestion}
                className="w-full"
              >
                Add Question
              </Button>

            </motion.div>


            <div className="text-left">

              <p className="text-zinc-400 text-sm">

                Questions Added:
                {" "}
                {questions.length}

              </p>

            </div>


            <motion.div
              whileHover={{scale:1.04}}
              whileTap={{scale:0.95}}
            >

              <Button
                onClick={submitQuestions}
                className="w-full"
              >
                Submit Questions
              </Button>

            </motion.div>

          </div>

        )}


        <motion.div
          whileHover={{
            scale:1.05
          }}

          whileTap={{
            scale:0.95
          }}
        >

          <Button
            variant="secondary"
            onClick={startQuiz}
            disabled={!roomId}
            className="
            w-full
            bg-white
            text-black
            hover:bg-zinc-300
            "
          >
            Start Quiz
          </Button>

        </motion.div>

      </motion.div>

    </div>
  );
}