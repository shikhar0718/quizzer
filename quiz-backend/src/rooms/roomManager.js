const rooms = {};

export const createRoom = (roomId, hostSocketId) => {
  rooms[roomId] = {
    host: hostSocketId,
    players: {},
    questions: [],
    currentQuestionIndex: 0
  };
};

export const addPlayer = (roomId, socketId, name) => {
  if (!rooms[roomId]) return;

  rooms[roomId].players[socketId] = {
    name,
    score: 0
  };
};

export const getRoom = (roomId) => {
  return rooms[roomId];
};

export const updateScore = (roomId, socketId, isCorrect) => {
  if (isCorrect) {
    rooms[roomId].players[socketId].score += 1;
  }
};