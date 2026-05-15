import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-black via-zinc-950 to-black text-white flex flex-col items-center justify-center px-6">

      {/* HERO */}
      <div className="text-center space-y-5">

        <h1 className="text-6xl font-extrabold tracking-tight bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Quizzer
        </h1>

        <p className="text-zinc-400 text-lg">
          Real-time multiplayer quiz experience
        </p>

        {/* BUTTONS */}
        <div className="flex gap-4 justify-center pt-4">

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
          >
            <Button
              variant="ghost"
              size="lg"
              className="
              border border-zinc-800
              hover:bg-zinc-500
              transition-all
              duration-300
              hover:shadow-lg
              hover:shadow-zinc-800
              "
              onClick={() => navigate("/teacher")}
            >
              Create Quiz
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
          >
            <Button
              variant="ghost"
              size="lg"
              className="
              border border-zinc-800
              hover:bg-zinc-500
              transition-all
              duration-300
              hover:shadow-lg
              hover:shadow-zinc-800
              "
              onClick={() => navigate("/student")}
            >
              Join Quiz
            </Button>
          </motion.div>

        </div>

      </div>


      {/* FEATURES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full">

        <Card
          className="
          bg-zinc-900/60
          backdrop-blur
          border
          border-zinc-800
          hover:scale-105
          hover:-translate-y-2
          transition-all
          duration-300
          hover:shadow-s
          hover:shadow-zinc-900
          "
        >
          <CardContent className="p-6">

            <h3 className="text-xl font-semibold mb-2 text-zinc-100">
              ⚡ Real-time
            </h3>

            <p className="text-zinc-400 text-sm">
              Instant updates & live gameplay
            </p>

          </CardContent>
        </Card>


        <Card
          className="
           bg-zinc-900/60 
          backdrop-blur
          border
          border-zinc-800
          hover:scale-105
          hover:-translate-y-2
          transition-all
          duration-300
          hover:shadow-m
          hover:shadow-zinc-900
          "
        >
          <CardContent className="p-6">

            <h3 className="text-xl font-semibold mb-2 text-zinc-100">
              🎮 Multiplayer
            </h3>

            <p className="text-zinc-400 text-sm">
              Play with friends in the same room
            </p>

          </CardContent>
        </Card>


        <Card
          className="
          bg-zinc-900/60
          backdrop-blur
          border
          border-zinc-800
          hover:scale-105
          hover:-translate-y-2
          transition-all
          duration-300
          hover:shadow-l
          hover:shadow-zinc-900
          "
        >
          <CardContent className="p-6">

            <h3 className="text-xl font-semibold mb-2 text-zinc-100">
              🏆 Leaderboard
            </h3>

            <p className="text-zinc-400 text-sm">
              Track scores in real-time
            </p>

          </CardContent>
        </Card>

      </div>

    </div>
  );
}