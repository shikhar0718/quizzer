import {
  createRoom,
  addPlayer,
  getRoom,
  updateScore
} from "../rooms/roomManager.js";

const initSocket = function (io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("createRoom", ({ roomId }) => {
      if(!roomId){
        socket.emit("error","please give room ID");
        return;
      }
      
      const existingRoom = getRoom(roomId);
       if (existingRoom) {
        socket.emit("error", "Room already exists");
        return;
        }
      createRoom(roomId, socket.id);
      socket.join(roomId);

      console.log(`Room is created with this id: ${roomId}`);
    });

    socket.on("joinRoom",({roomId,name}) =>{
        const room = getRoom(roomId);

        if(!room){
            socket.emit("error", "Room not found");
            return;
        }
        if(!name){
            socket.emit("error","Name is not provided");
            return;
        }
        
        addPlayer(roomId,socket.id,name);
        socket.join(roomId);

        console.log(`${name} joined room ${roomId}`);
        io.to(roomId).emit("playerJoined", { name });
    })

    // moving on to the next question

    socket.on("nextQuestion",({roomId})=>{
        const room = getRoom(roomId);
        if(!room){ 
            socket.emit("error", "Room not found");
            return;
        }

        const nextQuestionIndex=room.currentQuestionIndex++;
        const nextQuestion = room.questions[nextQuestionIndex];
        if(!nextQuestion){
            io.to(roomId).emit("QuizEnded");
            return;
        }

        for (let id in room.players) {
            room.players[id].answered = false;
        }
        io.to(roomId).emit("newQuestion",nextQuestion);
    });

    //  starting the quiz
    socket.on("quizStart",({roomId})=>{
        const room = getRoom(roomId);
        if(!room){
            socket.emit("error", "Room not found");
            return;
        }
        if (!room.questions || room.questions.length === 0) {
            socket.emit("error", "No questions set");
            return;
        }
        if(room.host !== socket.id){
            socket.emit("error", "Only host can start the quiz");
            return;
        }
        room.currentQuestionIndex = 0;
        const firstQuestion = room.questions[0];
        io.to(roomId).emit("newQuestion",firstQuestion);
    })

    //  submit the answer
   socket.on("submitAnswer", ({ roomId, answerIndex }) => {
        const room = getRoom(roomId);

         if (!room) {
            socket.emit("error", "Room not found");
            return;
        }

        if (room.players[socket.id].answered) return;
        
        room.players[socket.id].answered = true;
        const qIndex = room.currentQuestionIndex;
        const question = room.questions[qIndex];

        if (!question) {
            socket.emit("error", "No active question");
            return;
        }
        const isCorrect = answerIndex === question.correctAnswer;

        updateScore(roomId, socket.id, isCorrect);

        io.to(roomId).emit("leaderboard", room.players);
    });
    
    //  set the questions

    socket.on("setQuestions", ({ roomId, questions }) => {
        const room = getRoom(roomId);
        if (!room) {
            socket.emit("error", "Room not found");
            return;
        }

        if (room.host !== socket.id) {
            socket.emit("error", "Only host can set questions");
            return;
        }
        if (!questions || questions.length === 0) {
            socket.emit("error", "No questions provided");
            return;
        }
        if (questions.length > 10) {
            socket.emit("error", "Maximum 10 questions allowed");
            return;
        }
        room.questions = questions;
        room.currentQuestionIndex = 0;

        console.log(`Questions set for room ${roomId}`);
        socket.emit("questionsSet", "Questions added successfully");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

  });
};

export default initSocket;

















































// import {
//   createRoom,
//   addPlayer,
//   getRoom,
//   updateScore
// } from "../rooms/roomManager.js";

// const initSocket = function (io) {
//   io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);

//     // 🧑‍🏫 CREATE ROOM
//     socket.on("createRoom", ({ roomId }) => {
//       if (!roomId) {
//         socket.emit("error", "Please give room ID");
//         return;
//       }

//       const existingRoom = getRoom(roomId);
//       if (existingRoom) {
//         socket.emit("error", "Room already exists");
//         return;
//       }

//       createRoom(roomId, socket.id);
//       socket.join(roomId);

//       console.log(`Room created: ${roomId}`);
//     });

//     // 🎮 JOIN ROOM
//     socket.on("joinRoom", ({ roomId, name }) => {
//       const room = getRoom(roomId);

//       if (!room) {
//         socket.emit("error", "Room not found");
//         return;
//       }

//       if (!name) {
//         socket.emit("error", "Name is required");
//         return;
//       }

//       // prevent duplicate join
//       if (room.players[socket.id]) {
//         socket.emit("error", "Already joined");
//         return;
//       }

//       addPlayer(roomId, socket.id, name);
//       socket.join(roomId);

//       console.log(`${name} joined ${roomId}`);

//       io.to(roomId).emit("playerJoined", {
//         players: room.players
//       });
//     });

//     // 🚀 START QUIZ
//     socket.on("quizStart", ({ roomId }) => {
//       const room = getRoom(roomId);

//       if (!room) {
//         socket.emit("error", "Room not found");
//         return;
//       }

//       if (room.host !== socket.id) {
//         socket.emit("error", "Only host can start");
//         return;
//       }

//       if (!room.questions || room.questions.length === 0) {
//         socket.emit("error", "No questions set");
//         return;
//       }

//       room.currentQuestionIndex = 0;

//       // reset answers
//       for (let id in room.players) {
//         room.players[id].answered = false;
//       }

//       const firstQuestion = room.questions[0];

//       io.to(roomId).emit("newQuestion", firstQuestion);
//     });

//     // ➡️ NEXT QUESTION
//     socket.on("nextQuestion", ({ roomId }) => {
//       const room = getRoom(roomId);

//       if (!room) {
//         socket.emit("error", "Room not found");
//         return;
//       }

//       room.currentQuestionIndex++;

//       const nextQuestion = room.questions[room.currentQuestionIndex];

//       if (!nextQuestion) {
//         io.to(roomId).emit("quizEnded");
//         return;
//       }

//       // reset answers
//       for (let id in room.players) {
//         room.players[id].answered = false;
//       }

//       io.to(roomId).emit("newQuestion", nextQuestion);
//     });

//     // ✅ SUBMIT ANSWER
//     socket.on("submitAnswer", ({ roomId, answerIndex }) => {
//       const room = getRoom(roomId);

//       if (!room) {
//         socket.emit("error", "Room not found");
//         return;
//       }

//       const player = room.players[socket.id];
//       if (!player) return;

//       // prevent multiple answers
//       if (player.answered) return;

//       player.answered = true;

//       const qIndex = room.currentQuestionIndex;
//       const question = room.questions[qIndex];

//       if (!question) {
//         socket.emit("error", "No active question");
//         return;
//       }

//       const isCorrect = answerIndex === question.correctAnswer;

//       updateScore(roomId, socket.id, isCorrect);

//       io.to(roomId).emit("leaderboard", room.players);
//     });

//     // 🧠 SET QUESTIONS
//     socket.on("setQuestions", ({ roomId, questions }) => {
//       const room = getRoom(roomId);

//       if (!room) {
//         socket.emit("error", "Room not found");
//         return;
//       }

//       if (room.host !== socket.id) {
//         socket.emit("error", "Only host can set questions");
//         return;
//       }

//       if (!questions || questions.length === 0) {
//         socket.emit("error", "No questions provided");
//         return;
//       }

//       if (questions.length > 10) {
//         socket.emit("error", "Max 10 questions allowed");
//         return;
//       }

//       room.questions = questions;
//       room.currentQuestionIndex = 0;

//       console.log(`Questions set for ${roomId}`);

//       socket.emit("questionsSet");
//     });

//     socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//     });
//   });
// };

// export default initSocket;

