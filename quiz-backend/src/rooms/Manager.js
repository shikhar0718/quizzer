const rooms = {};


export const ROOM_STATE = {
  WAITING: "waiting",
  RUNNING: "running",
  ENDED: "ended"
};

// create room
export const createRoom = (roomId, hostSocketId) => {
	console.log("[ROOM MANAGER] creating room:", roomId);
  
	rooms[roomId] = {
		state:ROOM_STATE.WAITING,
		host: hostSocketId,
		players: {},
		questions: [],
		currentQuestionIndex: 0
	};
};

// add player
export const addPlayer = (roomId, socketId, name) => {
	const room = rooms[roomId];

	// check room exists
	if (!room) return;

	// prevent duplicate
	if (room.players[socketId]) return;

	console.log("[ROOM MANAGER] adding player:", name, "->", roomId);

	room.players[socketId] = {
		name,
		score: 0,
		answered: false
	};
};

// remove player
export const removePlayer = (roomId, socketId) => {
	const room = rooms[roomId];
	if (!room) return;

	console.log("[ROOM MANAGER] removing player:", socketId, "from", roomId);

	delete room.players[socketId];
};

// get room
export const getRoom = (roomId) => rooms[roomId];

// update score
export const updateScore = (roomId, socketId, isCorrect) => {
	const room = rooms[roomId];

	// safety
	if (!room || !room.players[socketId]) return;

	if (isCorrect) {
		room.players[socketId].score += 1;
		console.log("[SCORE UPDATE]", socketId, "new score:", room.players[socketId].score);
	}
};

// reset answers
export const resetAnswers = (roomId) => {
	const room = rooms[roomId];
	if (!room) return;

	console.log("[RESET ANSWERS]", roomId);

	for (let id in room.players) {
		room.players[id].answered = false;
	}
};

// delete room if empty
export const deleteRoomIfEmpty = (roomId) => {
	const room = rooms[roomId];
	if (!room) return;

	if (Object.keys(room.players).length === 0) {
		console.log("[ROOM DELETED]", roomId);
		delete rooms[roomId];
	}
};