import {
	createRoom,
	addPlayer,
	getRoom,
	removePlayer,
	deleteRoomIfEmpty
} from "../../rooms/roomManager.js";

import {nanoid} from "nanoid";

function generateRoomId(){
	return nanoid(6).toUpperCase();
}

// create room
export const handleCreateRoom = (socket, io) => () => {

	

	if (socket.data.roomId)
		return socket.emit("error", "Already in a room");

	const roomId = generateRoomId();console.log("[CREATE ROOM ATTEMPT]", socket.id, roomId);



	if (getRoom(roomId))
		return socket.emit("error", "Room already exists");

	createRoom(roomId, socket.id);

	socket.data.roomId = roomId;
	socket.data.isHost = true;

	socket.join(roomId);

	console.log("[ROOM CREATED]", roomId, "host:", socket.id);

	socket.emit("roomCreated", { roomId });
};

// join room
export const handleJoinRoom = (socket, io) => ({ roomId, name }) => {

	console.log("[JOIN ATTEMPT]", name, socket.id, roomId);

	const room = getRoom(roomId);

	if (!room) return socket.emit("error", "Room not found");
	if (socket.data.roomId) return socket.emit("error", "Already in a room");
	if (!name) return socket.emit("error", "Name required");

	if (room.players[socket.id])
		return socket.emit("error", "Already joined");

	addPlayer(roomId, socket.id, name);

	socket.data.roomId = roomId;
	socket.data.name = name;

	socket.join(roomId);

	console.log("[JOIN SUCCESS]", name, "->", roomId);

	io.to(roomId).emit("playersUpdate", {
  		players: Object.values(room.players)
	});
};

// leave room
export const handleLeaveRoom = (socket, io) => () => {

	const roomId = socket.data.roomId;
	if (!roomId) return;

	console.log("[LEAVE ROOM]", socket.id, roomId);

	const room = getRoom(roomId);
	if (!room) return;

	removePlayer(roomId, socket.id);

	io.to(roomId).emit("playerLeft", { players: room.players });

	socket.leave(roomId);
	deleteRoomIfEmpty(roomId);

	socket.data = { roomId: null, name: null, isHost: false };
};

// disconnect
export const handleDisconnect = (socket, io) => () => {

	const roomId = socket.data.roomId;

	console.log("[DISCONNECT]", socket.id, roomId);

	if (!roomId) return;

	const room = getRoom(roomId);
	if (!room) return;

	removePlayer(roomId, socket.id);

	io.to(roomId).emit("playerLeft", { players: room.players });

	deleteRoomIfEmpty(roomId);
};