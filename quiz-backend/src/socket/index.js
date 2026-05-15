import { handleCreateRoom,handleJoinRoom,handleLeaveRoom,handleDisconnect } from "./handlers/roomHandlers.js";
import { handleQuizStart,handleNextQuestion,handleSubmitAnswer,handleSetQuestions,handleGetCurrentQuestion } from "./handlers/quizHandlers.js";

const initSocket = (io) => {
	io.on("connection", (socket) => {

		console.log("[CONNECT]", socket.id);

		socket.data = {
			roomId: null,
			name: null,
			isHost: false
		};

		socket.on("createRoom", handleCreateRoom(socket, io));
		socket.on("joinRoom", handleJoinRoom(socket, io));
		socket.on("leaveRoom", handleLeaveRoom(socket, io));

		socket.on("quizStart", handleQuizStart(socket, io));
		socket.on("nextQuestion", handleNextQuestion(socket, io));
		socket.on("submitAnswer", handleSubmitAnswer(socket, io));
		socket.on("setQuestions", handleSetQuestions(socket, io));
		socket.on("getCurrentQuestion",handleGetCurrentQuestion(socket, io));

		socket.on("disconnect", handleDisconnect(socket, io));
	});
};

export default initSocket;