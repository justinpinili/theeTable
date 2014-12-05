var schema = require('./../schema.js');

var disconnectFromRoom = function(schema, roomName, userName, io) {
	// console.log("disconnected");
	var searchRoom  = schema.Room.where({ name: roomName });
	searchRoom.findOne(function (err, room) {
		if (!err) {
			if (room === null) {
				return;
			} else {
				room.users.splice(room.users.indexOf(userName),1);
				room.save(function (err) {
					if (!err) {
						// console.log("user removed!");
						io.to(room.name).emit('usersInRoom', { users: room.users });
						return;
					}
					disconnectFromRoom(schema, roomName, userName, io);
					// console.log(err);
					return;
				});
				return;
			}
		}
		console.log(err);
		return;
	});
}

module.exports = function(io) {

	// Once someone visits Thee Table application
	io.on('connection', function (socket) {
		// console.log('connected');

		var userName;
		var roomName;
		var chatMessage;

		/*******************************
		 * Current Users in Room Logic *
		 *******************************/

		// Once someone navigates out of a current page.
		// Mainly used for notifying current users in the room that a particular user
		// has left the room.
		socket.on('disconnect', function () {
			disconnectFromRoom(schema, roomName, userName, io);
		});

		// Once a user enters an existing room.
		socket.on('roomEntered', function(data) {
			// console.log(data);

			userName = data.user;
			roomName = data.room;
			var searchRoom  = schema.Room.where({ name: roomName });
			searchRoom.findOne(function (err, room) {
				if (!err) {
					if (room === null) {
						return;
					} else {
						// room.users = [];
						currentRoom = room;
						room.users.push(userName);
						room.save(function (err) {
							if (!err) {
								// console.log("user added!");
								socket.join(room.name);
								io.to(room.name).emit('usersInRoom', { users: room.users });
								return;
							}
							console.log(err);
							return;
						});
						return;
					}
				}
				console.log(err);
				return;
			});
		});

		/*********************
		* Current Chat Logic *
		**********************/

		socket.on('newChatMessage', function(data) {
			chatMessage = data.msg;
			// console.log(chatMessage);

			var searchRoom  = schema.Room.where({ name: roomName });
			searchRoom.findOne(function (err, room) {
				if (!err) {
					if (room === null) {
						return;
					} else {
						// room.chat = [];
						room.chat.push({user: userName, msg: chatMessage});
						room.save(function(err) {
							if (!err) {
								// console.log("user added!");
								room = room;
								io.to(roomName).emit('updatedChat', { chat: room.chat });
								return;
							}
							console.log(err);
							return;
						});
						return;
					}
				}
				console.log(err);
				return;
			});
		});

		/**********************
		* Current Queue Logic *
		***********************/

		socket.on('newQueueItem', function(data) {
			newQueueItem = { source: data.source, votes: 0 };
			// console.log(chatMessage);

			var searchRoom  = schema.Room.where({ name: roomName });
			searchRoom.findOne(function (err, room) {
				if (!err) {
					if (room === null) {
						return;
					} else {
						// room.queue = [];
						room.queue.push(newQueueItem);
						room.save(function(err) {
							if (!err) {
								// console.log("user added!");
								room = room;
								io.to(roomName).emit('updatedQueue', { queue: room.queue });
								return;
							}
							console.log(err);
							return;
						});
						return;
					}
				}
				console.log(err);
				return;
			});
		});

	});

	return;
}
