module.exports = function(io) {

	var express = require('express');
	var schema = require('./../schema.js');
	var router = express.Router();

	// Go to room selection
	router.get('/rooms', function(req, res) {
		// console.log('rooms');
		schema.Room.find({}, function(err, rooms) {
			if (!err) {
				// console.log(rooms);
				res.send({rooms: rooms});
				return;
			}

			console.log(err);
			res.send(err);
			return;
		});
	});

	// Create a new room
	router.post('/rooms', function(req, res) {
		var newRoom = new schema.Room({
																		name: req.body.name,
																		queue: [],
																		chat: [],
																		users: []
																	});
		newRoom.save(function (err) {
			if (!err) {
				// console.log('new room saved!');
				res.send(newRoom);
				return;
			}
			if (err.code === 11000) {
				res.send({ message: "Room already exists. Please choose a different name." });
				return;
			}
			console.log(err);
			res.send(err);
			return;
		});
	});


	// Go into an existing room
	// otherwise, redirect to the room selection
	router.get('/rooms/:id', function(req, res) {
		// console.log('rooms/'+req.params.id);


		var searchRoom  = schema.Room.where({ name: req.params.id });
		searchRoom.findOne(function (err, room) {
			if (!err) {
				if (room === null) {
					res.send({ message: "Room does not exist" });
					return;
				} else {
					console.log('API users: ' + room.users);
					res.send(room);
					return;
				}
			}
			console.log(err);
			res.send(err);
			return;
		});
	});

	io.on('connection', function (socket) {
		// console.log('connected');

		socket.on('disconnect', function () {
			// console.log("disconnected");

			var searchRoom  = schema.Room.where({ name: room });
			searchRoom.findOne(function (err, room) {
				if (!err) {
					if (room === null) {
						return;
					} else {
						room.users.splice(room.users.indexOf(user),1);
						room.save(function (err) {
							if (!err) {
								// console.log("user removed!");
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

		var user;
		var room;

		socket.on('roomEntered', function(data) {
			console.log(data);
			user = data.user;
			room = data.room;

			var searchRoom  = schema.Room.where({ name: room });
			searchRoom.findOne(function (err, room) {
				if (!err) {
					if (room === null) {
						return;
					} else {
						room.users.push(user);
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
	});

	return router;
};
