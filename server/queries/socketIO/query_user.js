var schema = require('./../../schema.js');

// Rotate the playlist so that last played song is at the bottom.
module.exports.updatePlaylist = function(roomName, userName, socket) {
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
						socket.emit('rotatedPlaylist', { playlist: user.playlist });
						return;
					}
					console.log("error saving user - rotatedPlaylist");
					console.log(err);
					return;
				});
				return;
			}
		}
		console.log("error finding user - rotatedPlaylist");
		console.log(err);
		return;
	});
}

// Adding new song to the playlist.
module.exports.newPlaylistItem = function(roomName, userName, playlistItem, socket) {
	// console.log(playlistItem);
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

// Update entire playlist.
module.exports.newPlaylist = function(roomName, userName, playlist, socket) {
	var searchUser  = schema.User.where({ username: userName });
	searchUser.findOne(function (err, user) {
		if (!err) {
			if (user === null) {
				console.log("user not found");
				return;
			} else {
				// user.playlist = [];
				user.playlist = playlist;
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

// Update entire favorites.
module.exports.newFavorites = function(roomName, userName, favorites, socket) {
	var searchUser  = schema.User.where({ username: userName });
	searchUser.findOne(function (err, user) {
		if (!err) {
			if (user === null) {
				console.log("user not found");
				return;
			} else {
				// user.playlist = [];
				user.favorites = favorites;
				user.save(function(err) {
					if (!err) {
						// console.log("user added!");
						user = user;
						socket.emit('updatedFavorites', { favorites: user.favorites });
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

module.exports.addToLikes = function(userName, song, socket) {
	var searchUser  = schema.User.where({ username: userName });
	searchUser.findOne(function (err, user) {
		if (!err) {
			if (user === null) {
				console.log("user not found");
				return;
			} else {
				// user.playlist = [];
				user.favorites.push(song);
				user.save(function(err) {
					if (!err) {
						// console.log("user added!");
						user = user;
						socket.emit('updatedFavorites', { favorites: user.favorites });
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

module.exports.addRoom = function(userName, room, socket) {
	var searchUser  = schema.User.where({ username: userName });
	searchUser.findOne(function (err, user) {
		if (!err) {
			if (user === null) {
				console.log("user not found");
				return;
			} else {
				// user.playlist = [];
				user.rooms.push(room);
				user.save(function(err) {
					if (!err) {
						// console.log("user added!");
						user = user;
						socket.emit('updatedRooms', { rooms: user.rooms });
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

module.exports.newRooms = function(userName, rooms, socket) {
	var searchUser  = schema.User.where({ username: userName });
	searchUser.findOne(function (err, user) {
		if (!err) {
			if (user === null) {
				console.log("user not found");
				return;
			} else {
				// user.playlist = [];
				user.rooms = rooms;
				user.save(function(err) {
					if (!err) {
						// console.log("user added!");
						user = user;
						socket.emit('updatedRooms', { rooms: user.rooms });
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
