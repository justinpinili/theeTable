var schema = require('./../schema.js');

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

// Adding new song to the playlist.
module.exports.newPlaylistItem = function(roomName, userName, playlistItem, socket) {
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
