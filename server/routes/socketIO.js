var query_room = require('./../queries/socketIO/query_room.js');
var query_user = require('./../queries/socketIO/query_user.js');
var api = require('./../queries/api/query_user.js');

module.exports = function(io) {

	// Once someone visits Thee Table application
	io.on('connection', function (socket) {

		// Local variables for each socket.
		var userName;
		var roomName;

		/*******************************
		 * Current Users in Room Logic *
		 *******************************/

		// Once a user enters an existing room.
		socket.on('roomEntered', function(data) {
			roomName = data.roomName;
			userName = data.user;
			query_room.connectToRoom(roomName, userName, socket, io);
		});

		// Once someone navigates out of a current page.
		// Mainly used for notifying current users in the room that a particular user
		// has left the room.
		socket.on('disconnect', function () {
			query_room.disconnectFromRoom(roomName, userName, io);
		});

		/**********************
		 * Current Chat Logic *
		 **********************/

		// Update room with new chat message.
		socket.on('newChatMessage', function(data) {
			query_room.newChatMessage(roomName, userName, data.msg, io);
		});

		/***********************
		 * Current Queue Logic *
		 ***********************/

		// Update room with new current time from DJ.
		socket.on('currentTime', function(data) {
			query_room.updateCurrentTime(roomName, userName, data.time, io);
		});

		// Update room with new DJ added to the queue.
		socket.on('addToQueue', function(data) {
			query_room.addToQueue(roomName, data.user, io);
		});

		// Update room with DJ removed from the queue.
		socket.on('removeFromQueue', function(data) {
			query_room.removeFromQueue(roomName, data.user, io);
		});

		// Update room with new queue rotation, current DJ and song.
		socket.on('newQueue', function(data) {
			query_room.newQueue(roomName, userName, data.queue, io);
		});

		// Update user playlist with rotated last played song to the end.
		socket.on('updatePlaylist', function(data) {
			query_user.updatePlaylist(roomName, data.username, socket);
		});

		socket.on('userName', function(data) {
			userName = data.username;
			api.getUser(data.username, function(user) {
				io.emit('signOn', { username: data.username, loginTime: user.loginTime });
			});
		});

		/************************************
		 * New Song for User Playlist Logic *
		 ************************************/

		// Update user playlist with new song.
		socket.on('newPlaylistItem', function(data) {
			// var playlistItem = { source: data.source, title: data.title, artist: data.artist, length: data.length, soundcloudID: data. };
			query_user.newPlaylistItem(roomName, userName, data.song, socket);
		});

		socket.on('newPlaylist', function(data) {
			query_user.newPlaylist(roomName, userName, data.playlist, socket);
		});

	});
	return;
}
