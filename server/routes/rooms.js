var express = require('express');
var schema = require('./../schema.js');
var router = express.Router();

// Go to room selection
router.get('/rooms', function(req, res) {
	console.log('rooms');
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
			console.log('new room saved!');
			res.send(newRoom);
			return;
		}
		if (err.code === 11000) {
			res.send("Room already exists. Please choose a different name.");
			return;
		}
		console.log(err);
		res.send(err);
	});
});


// Go into an existing room
// otherwise, redirect to the room selection
router.get('/rooms/:id', function(req, res) {
	console.log('rooms/'+req.params.id);
	var searchRoom  = schema.Room.where({ name: req.params.id });
	searchRoom.findOne(function (err, room) {
		if (!err) {
			if (room === null) {
				res.send("Room does not exist");
				return;
			} else {
				res.send(room);
				return;
			}
		}
		console.log(err);
		res.send(err);
		return;
	});
});

module.exports = router;
