var schema = require('./../schema.js');
module.exports = function(io) {
	// Once someone visits Thee Table application
	io.on('connection', function (socket) {
		var userName;
		var roomName;
		/*******************************
		 * Current Users in Room Logic *
		 *******************************/
		// Once a user enters an existing room.
		socket.on('roomEntered', function(data) {
			roomName = data.roomName;
			userName = data.user;
			connectToRoom(roomName, userName, socket, io);
		});
		var connectToRoom = function(roomName, userName, socket, io) {
			var searchRoom  = schema.Room.where({ name: roomName });
			searchRoom.findOne(function (err, room) {
				if (!err) {
					if (room === null) {
						console.log("room not found");
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
		}
		// Once someone navigates out of a current page.
		// Mainly used for notifying current users in the room that a particular user
		// has left the room.
		socket.on('disconnect', function () {
			disconnectFromRoom(schema, roomName, userName, io);
		});
		var disconnectFromRoom = function(schema, roomName, userName, io) {
			var currentDjLeft = false;
			var searchRoom  = schema.Room.where({ name: roomName });
			searchRoom.findOne(function (err, room) {
				if (!err) {
					if (room === null) {
						console.log("room not found");
						return;
					} else {
						room.users.splice(room.users.indexOf(userName),1);
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
								if (currentDjLeft) {
									io.to(room.name).emit('roomUpdate', {room: room});
								}
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
		/**********************
		 * Current Chat Logic *
		 **********************/
		socket.on('newChatMessage', function(data) {
			newChatMessage(schema, roomName, userName, data.msg, io);
		});
		var newChatMessage = function(schema, roomName, userName, chatMessage, io) {
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
		};
		/***********************
		 * Current Queue Logic *
		 ***********************/
		socket.on('currentTime', function(data) {
			updateCurrentTime(schema, roomName, userName, data.time, io);
		});
		var updateCurrentTime = function(schema, roomName, userName, currentTime, io) {
			var searchRoom = schema.Room.where({ name: roomName });
			searchRoom.findOne(function (err, room) {
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
		socket.on('addToQueue', function(data) {
			addToQueue(schema, roomName, data.user, io);
		});
		var addToQueue = function(schema, roomName, userName, io) {
			var searchRoom = schema.Room.where({ name: roomName });
			searchRoom.findOne(function (err, room) {
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
									room.currentSong = user.playlist[0].source;
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
		socket.on('newQueue', function(data) {
			newQueue(schema, roomName, userName, data.queue, io);
		});
		var newQueue = function(schema, roomName, userName, queue, io) {
			var previousDJ = queue.shift();
			queue.push( previousDJ );
			var searchRoom = schema.Room.where({ name: roomName });
			searchRoom.findOne(function (err, room) {
				if (!err) {
					if (room === null) {
						console.log("not found");
						return;
					} else {
						room.queue = queue;
						var searchUser = schema.User.where({ username: room.queue[0] });
						searchUser.findOne(function (err, user) {
							if (!err) {
								room.currentDJ = user.username;
								room.currentSong = user.playlist[0].source;
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
		socket.on('updatePlaylist', function(data) {
			updatePlaylist(schema, roomName, data.username, socket);
		});
		var updatePlaylist = function(schema, roomName, userName, socket) {
			var searchUser  = schema.User.where({ username: userName });
			searchUser.findOne(function (err, user) {
				if (!err) {
					if (user === null) {
						console.log("user not found");
						return;
					} else {
						// user.playlist = [];
						var oldSong = user.playlist.shift();
						user.playlist.push(oldSong);
						user.save(function(err) {
							if (!err) {
								user = user;
								socket.emit('updatedPlaylist', { playlist: user.playlist });
								return;
							}
							console.log("error saving user - updatePlaylist");
							console.log(err);
							return;
						});
						return;
					}
				}
				console.log("error finding user - updatePlaylist");
				console.log(err);
				return;
			});
		}
		/************************************
		 * New Song for User Playlist Logic *
		 ************************************/
		socket.on('newPlaylistItem', function(data) {
			var playlistItem = { source: data.source, votes: 0 };
			newPlaylistItem(schema, roomName, userName, playlistItem, socket);
		});
		var newPlaylistItem = function(schema, roomName, userName, playlistItem, socket) {
			var searchUser  = schema.User.where({ username: userName });
			searchUser.findOne(function (err, user) {
				if (!err) {
					if (user === null) {
						console.log("user not found");
						return;
					} else {
						// user.playlist = [];
						user.playlist.push(playlistItem);
						user.save(function(err) {
							if (!err) {
								// console.log("user added!");
								user = user;
								socket.emit('updatedPlaylist', { playlist: user.playlist });
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
	});
	return;
}
