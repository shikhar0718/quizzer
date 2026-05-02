import {
	getRoom,
	updateScore,
	resetAnswers
} from "../../rooms/roomManager.js";

// start quiz
export const handleQuizStart = (socket, io) => ({ roomId }) => {

	console.log("[QUIZ START ATTEMPT]", socket.id, roomId);

	const room = getRoom(roomId);

	if (!room) return socket.emit("error", "Room not found");
	if (room.host !== socket.id)
		return socket.emit("error", "Only host can start");

	if (!room.questions.length)
		return socket.emit("error", "No questions");

	room.currentQuestionIndex = 0;
	resetAnswers(roomId);

	console.log("[QUIZ STARTED]", roomId);

	io.to(roomId).emit("quizStarted");

	io.to(roomId).emit("newQuestion", {
		question: {
			text:room.questions[0].question,
			options:room.questions[0].options
		},
		index: 0,
		total: room.questions.length
	});
};

// next question
export const handleNextQuestion = (socket, io) => ({ roomId }) => {

	const room = getRoom(roomId);

	if (!room) return socket.emit("error", "Room not found");
	if (room.host !== socket.id)
		return socket.emit("error", "Only host");

	if(room.currentQuestionIndex+1>=room.questions.length){
		console.log("[QUIZ ENDED]", roomId);

		return io.to(roomId).emit("quizEnded", {
			players: Object.values(room.players)
		});
	}
	room.currentQuestionIndex++;

	console.log("[NEXT QUESTION]", roomId, room.currentQuestionIndex);

	const q = room.questions[room.currentQuestionIndex];

	resetAnswers(roomId);

	io.to(roomId).emit("newQuestion", {
		question: {
			text:q.question,
			options:q.options
		},
		index: room.currentQuestionIndex,
		total: room.questions.length
	});
};

// submit answer
export const handleSubmitAnswer = (socket, io) => ({ roomId, answerIndex }) => {

	console.log("[ANSWER]", socket.id, "->", answerIndex);

	const room = getRoom(roomId);
	if (!room) return;

	const player = room.players[socket.id];
	if (!player || player.answered) return;

	player.answered = true;

	const q = room.questions[room.currentQuestionIndex];
	if (!q) return;

	updateScore(roomId, socket.id, answerIndex === q.correctAnswer);

	const players = Object.values(room.players).sort((a, b) => b.score - a.score);
	io.to(roomId).emit("leaderboard", { players });
};

// set questions
export const handleSetQuestions = (socket, io) => ({ roomId, questions }) => {

	console.log("[SET QUESTIONS]", roomId);

	const room = getRoom(roomId);

	if (!room) return socket.emit("error", "Room not found");
	if (room.host !== socket.id)
		return socket.emit("error", "Only host");

	if (!questions?.length)
		return socket.emit("error", "No questions");

	if (questions.length > 10)
		return socket.emit("error", "Max 10 questions");

	for (let q of questions) {
		if (!q.question || !Array.isArray(q.options) || q.options.length !== 4)
			return socket.emit("error", "Invalid format");

		if (q.correctAnswer < 0 || q.correctAnswer >= 4)
			return socket.emit("error", "Invalid answer index");
	}

	room.questions = questions.sort(() => Math.random() - 0.5);
	room.currentQuestionIndex = 0;

	console.log("[QUESTIONS SET SUCCESS]", questions.length);

	socket.emit("questionsSet");
};