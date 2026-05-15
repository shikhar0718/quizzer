import { useState, useEffect } from "react";
import socket from "../socket";
import { Button } from "@/components/ui/button";
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function Quiz() {

  const [question, setQuestion] = useState(null);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [players, setPlayers] = useState([]);
  const [votes, setVotes] = useState({ answered: 0, total: 0 });

  useEffect(() => {

    socket.emit("getCurrentQuestion", {
      roomId: socket.roomId
    });

    socket.on("newQuestion", (data) => {
      console.log("NEW QUESTION:", data);

      setQuestion(data.question);
      setIndex(data.index);
      setTotal(data.total);
      setSelected(null);
    });

    socket.on("leaderboard", ({ players }) => {
      setPlayers(players);
    });

    socket.on("voteUpdate", (data) => {
      setVotes(data);
    });

    socket.on("quizEnded", ({ players }) => {
      setPlayers(players);
      alert("Quiz Ended");
    });

    return () => {
      socket.off("newQuestion");
      socket.off("leaderboard");
      socket.off("voteUpdate");
      socket.off("quizEnded");
    };

  }, []);

  const handleAnswer = (i) => {

    if(socket.isHost) return;
    if(selected !== null) return;

    setSelected(i);

    socket.emit("submitAnswer", {
      roomId: socket.roomId,
      answerIndex: i
    });
  };

  const nextQuestion = () => {
    socket.emit("nextQuestion", {
      roomId: socket.roomId
    });
  };

  const current = index + 1;

  const quizPercent =
    total===0
      ?0
      :(current/total)*100;

  const votePercent =
    votes.total===0
      ?0
      :(votes.answered/votes.total)*100;


  if(!question){
    return(
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h2 className="text-xl">
          Waiting for question...
        </h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">

      <div className="w-full max-w-md space-y-6">

        {/* 🔥 Circular Quiz Progress */}
        <div className="flex justify-center">

          <AnimatedCircularProgressBar
            value={quizPercent}
            max={100}
            min={0}
            gaugePrimaryColor="rgb(34 197 94)"
            gaugeSecondaryColor="rgb(39 39 42)"
          />

        </div>

        <p className="text-center text-zinc-400">
          Question {current}/{total}
        </p>


        {/* Question */}

        <motion.h2
          key={question.text}
          initial={{
            opacity:0,
            y:20
          }}

          animate={{
            opacity:1,
            y:0
          }}

          className="
          text-xl
          font-bold
          text-center
          "
        >
          {question.text}
        </motion.h2>


        {/* Options */}

        <div className="flex flex-col gap-3">

          {question.options.map((opt,i)=>(

            <motion.div
              key={i}

              whileHover={{
                scale:1.02
              }}

              whileTap={{
                scale:0.95
              }}

              animate={{
                scale:selected===i?1.04:1
              }}
            >

              <Button
                onClick={()=>handleAnswer(i)}

                disabled={
                  selected!==null ||
                  socket.isHost
                }

                className={`
                w-full
                transition-all
                duration-300

                ${
                  selected===i
                  ? "bg-green-600 ring-4 ring-green-400"
                  : ""
                }
                `}
              >
                {selected===i
                ? "✓ Selected"
                : opt}
              </Button>

            </motion.div>

          ))}

        </div>


        {/* Vote progress */}

        <div>

          <div className="flex justify-between text-sm text-zinc-400">

            <span>
              Responses
            </span>

            <span>
              {votes.answered}/{votes.total}
            </span>

          </div>

          <Progress value={votePercent} />

        </div>


        {/* Leaderboard */}

        <div className="bg-zinc-900 p-4 rounded">

          <h3 className="text-sm text-zinc-400 mb-2">
            Leaderboard
          </h3>

          {players.map((p,i)=>(

            <div
              key={i}
              className="flex justify-between"
            >

              <span>
                {p.name}
              </span>

              <span>
                {p.score}
              </span>

            </div>

          ))}

        </div>


        {/* Next */}

        {socket.isHost && (

          <motion.div
            whileHover={{
              scale:1.04
            }}

            whileTap={{
              scale:0.95
            }}
          >

            <Button
              onClick={nextQuestion}
              className="w-full"
            >
              Next Question
            </Button>

          </motion.div>

        )}

      </div>
    </div>
  );
}