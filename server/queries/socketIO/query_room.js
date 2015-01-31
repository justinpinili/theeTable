var schema = require('./../../schema.js');

// Update room with new user that joined.
module.exports.connectToRoom = function(roomName, userName, socket, io) {
	schema.Room.where({ name: roomName }).findOne(function (err, room) {
		if (!err) {
			if (room === null) {
				console.log("room not found");
				return;
			} else {
				// room.users = [];
				// room.chat = [];
				currentRoom = room;
				room.users.push(userName);
				room.chat.push({ user: '', msg: userName + ' has entered the room.' });
				room.save(function (err) {
					if (!err) {
						// console.log("user added!");
						socket.join(room.name);
						io.to(room.name).emit('usersInRoom', { users: room.users });
						io.to(room.name).emit('updatedChat', { chat: room.chat });
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
}

// Update room with the user that left.
// Also check to see that that user is the current DJ
// and if so, remove accordingly.
module.exports.disconnectFromRoom = function(roomName, userName, io) {
	var currentDjLeft = false;
	schema.Room.where({ name: roomName }).findOne(function (err, room) {
		if (!err) {
			if (room === null) {
				console.log("room not found");
				return;
			} else {
				room.users.splice(room.users.indexOf(userName),1);
				room.chat.push({ user: '', msg: userName + ' has left the room.' });

				if (room.users.length === 0) {
					room.chat = [];
				}

				if (room.queue.indexOf(userName) === 0) {
					room.queue.splice(0, 1);
					room.currentDJ = null;
					room.currentSong = null;
					room.currentTime = null;
					currentDjLeft = true;
				} else if (room.queue.indexOf(userName) > 0) {
					room.queue.splice(room.queue.indexOf(userName), 1);
					io.to(roomName).emit('updatedQueue', { queue: room.queue });
				}

				room.save(function (err) {
					if (!err) {
						// console.log("user removed!");
						io.to(room.name).emit('usersInRoom', { users: room.users });
						io.to(room.name).emit('updatedChat', { chat: room.chat });
						if (currentDjLeft) {
							io.to(room.name).emit('roomUpdate', {room: room});
						}
						return;
					}
					module.exports.disconnectFromRoom(roomName, userName, io);
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

// Updates room with a new chat message.
module.exports.newChatMessage = function(roomName, userName, chatMessage, io) {
	schema.Room.where({ name: roomName }).findOne(function (err, room) {
		if (!err) {
			if (room === null) {
				return;
			} else {
				// room.chat = [];
				room.chat.push({user: userName, msg: chatMessage});
				if (room.chat.length > 100) {
					room.chat.splice(0,1);
				}

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
};

// Updates room with a new current time.
module.exports.updateCurrentTime = function(roomName, userName, currentTime, io) {
	schema.Room.where({ name: roomName }).findOne(function (err, room) {
		if (!err) {
			if (room === null) {
				console.log("not found");
				return;
			} else {
				room.currentTime = currentTime;
				room.save(function(err) {
					if (!err) {
						// console.log("user added!");
						room = room;
						io.to(roomName).emit('updatedCurrentTime', { time: room.currentTime });
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
};

// Add user to the room queue. if it's the first user in the queue
// retrieve song and username for currentDJ.
module.exports.addToQueue = function(roomName, userName, io) {
	schema.Room.where({ name: roomName }).findOne(function (err, room) {
		if (!err) {
			if (room === null) {
				console.log("room not found");
				return;
			} else {
				// room.queue = [];
				room.queue.push(userName);
				// if no one is a current DJ
				if (room.queue.length === 1) {
					schema.User.where({ username: userName }).findOne(function(err, user) {
						if (!err) {
							if (user === null) {
								res.send({ message: "No user found with the given username." });
								return;
							}
							room.currentSong = user.playlist[0];
							room.currentDJ = user.username;
							room.save(function(err) {
								if (!err) {
									// console.log("user added!");
									room = room;
									io.to(roomName).emit('updatedQueue', { queue: room.queue, currentDJ: room.currentDJ, currentSong: room.currentSong });
									return;
								}
								console.log(err);
								return;
							});
							return;
						}
						console.log(err);
						res.send(err);
						return;
					});
				}
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
};

// Remove user from the room queue.
module.exports.removeFromQueue = function(roomName, userName, io) {
	var currentDjLeft = true;
	schema.Room.where({ name: roomName }).findOne(function (err, room) {
		if (!err) {
			if (room === null) {
				console.log("room not found");
				return;
			} else {
				// room.queue = [];
				var djIndex = room.queue.indexOf(userName);
				room.queue.splice(djIndex, 1);

				if (djIndex === 0 && room.queue.length === 0) {
					room.queue.splice(0, 1);
					room.currentDJ = null;
					room.currentSong = null;
					room.currentTime = null;
					currentDjLeft = false;
				}

				if (room.queue.length >= 1) {
					schema.User.where({ username: room.queue[0] }).findOne(function(err, user) {
						if (!err) {
							if (user === null) {
								res.send({ message: "No user found with the given username." });
								return;
							}
							room.currentSong = user.playlist[0];
							room.currentDJ = user.username;
							room.save(function(err) {
								if (!err) {
									// console.log("user removed!");
									room = room;
									io.to(roomName).emit('updatedQueue', { queue: room.queue, currentDJ: room.currentDJ, currentSong: room.currentSong });
									return;
								}
								console.log(err);
								return;
							});
							return;
						}
						console.log(err);
						res.send(err);
						return;
					});
				}

				room.save(function(err) {
					if (!err) {
						// console.log("user removed!");
						room = room;
						io.to(roomName).emit('updatedQueue', { queue: room.queue });
						if (!currentDjLeft) {
							io.to(room.name).emit('roomUpdate', {room: room});
						}
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
};

// Rotate the queue and find the next DJ, song, and reset currentTime.
module.exports.newQueue = function(roomName, userName, queue, io) {
	if (queue.length === 0) {
		return;
	}

	var previousDJ = queue.shift();
	queue.push( previousDJ );
	schema.Room.where({ name: roomName }).findOne(function (err, room) {
		if (!err) {
			if (room === null) {
				console.log("not found");
				return;
			} else {
				room.queue = queue;
				schema.User.where({ username: room.queue[0] }).findOne(function (err, user) {
					if (!err) {
						room.currentDJ = user.username;
						room.currentSong = user.playlist[0];
						room.currentTime = null;

						room.save(function(err) {
							if (!err) {
								// console.log("user added!");
								room = room;
								io.to(roomName).emit('rotatedQueue', { queue: room.queue, currentDJ: room.currentDJ, currentSong: room.currentSong, currentTime: room.currentTime });
								return;
							}
							console.log("error saving room - newQueue");
							console.log(err);
							return;
						});
						return;
					}
					console.log("error finding user - newQueue");
					console.log(err);
					return;
				});
				return;
			}
		}
		console.log("error finding room - newQueue");
		console.log(err);
		return;
	});
};
