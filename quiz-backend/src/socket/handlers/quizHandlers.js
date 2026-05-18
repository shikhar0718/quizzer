import {
	getRoom,
	updateScore,
	resetAnswers,
	ROOM_STATE
} from "../../rooms/Manager.js";


// HELPER FUNCTION (NEW)
function emitVoteUpdate(io, roomId, room) {
	const totalPlayers = Object.keys(room.players).length;

	const answeredCount = Object.values(room.players)
		.filter(player => player.answered).length;

	io.to(roomId).emit("voteUpdate", {
		answered: answeredCount,
		total: totalPlayers
	});
}

// start quiz
export const handleQuizStart = (socket, io) => ({ roomId }) => {

	console.log("[QUIZ START ATTEMPT]", socket.id, roomId);

	const room = getRoom(roomId);

	if (!room) return socket.emit("error", "Room not found");
	if (room.host !== socket.id)
		return socket.emit("error", "Only host can start");

	if (!room.questions.length)
		return socket.emit("error", "No questions");

	if (room.state === ROOM_STATE.RUNNING)
		return socket.emit("error", "Quiz already started");

	room.currentQuestionIndex = 0;
	resetAnswers(roomId);

	// STATE CHANGE
	room.state = ROOM_STATE.RUNNING;
	room.startedAt=Date.now();
	// calculating waiting time 
	const waitingTime = room.startedAt - room.createdAt;
	console.log("Waiting time:", waitingTime);

	console.log("[QUIZ STARTED]", roomId);
	io.to(roomId).emit("quizStarted");
	emitVoteUpdate(io, roomId, room);

	io.to(roomId).emit("newQuestion", {
		question: {
			text: room.questions[0].question,
			options: room.questions[0].options
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

	if (room.state !== ROOM_STATE.RUNNING) return;

	if (room.currentQuestionIndex + 1 >= room.questions.length) {
		console.log("[QUIZ ENDED]", roomId);

		// STATE CHANGE
		room.state = ROOM_STATE.ENDED;
		const duration = Date.now() - room.startedAt;

		const players = Object.values(room.players)
  			.sort((a, b) => b.score - a.score);

		return io.to(roomId).emit("quizEnded", { players });
	}

	room.currentQuestionIndex++;
	console.log("[NEXT QUESTION]", roomId, room.currentQuestionIndex);
	const q = room.questions[room.currentQuestionIndex];
	resetAnswers(roomId);
	emitVoteUpdate(io, roomId, room);

	io.to(roomId).emit("newQuestion", {
		question: {
			text: q.question,
			options: q.options
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

	//  host can't answer
	if(socket.id === room.host){
		return socket.emit("error","host cannot submit answers")
	}
	
	if (room.state === ROOM_STATE.WAITING) {
		return socket.emit("error", "Quiz hasn't started yet");
	}
	if (room.state === ROOM_STATE.ENDED) {
		return socket.emit("error", "Quiz already ended");
	}

	const player = room.players[socket.id];
	if (!player || player.answered) return;

	player.answered = true;

	const q = room.questions[room.currentQuestionIndex];
	if (!q) return;

	updateScore(roomId, socket.id, answerIndex === q.correctAnswer);
	const players = Object.values(room.players)
		.sort((a, b) => b.score - a.score);
	io.to(roomId).emit("leaderboard", { players });
	emitVoteUpdate(io, roomId, room);
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

// getting the current question 

export const handleGetCurrentQuestion = (socket, io) => ({ roomId }) => {

	const room = getRoom(roomId);

	if (!room) return;
	if (!room.questions.length) return;

	const q = room.questions[room.currentQuestionIndex];

	socket.emit("newQuestion", {
		question: {
			text: q.question,
			options: q.options
		},
		index: room.currentQuestionIndex,
		total: room.questions.length
	});

	emitVoteUpdate(io, roomId, room);
};