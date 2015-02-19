var express       = require('express');
var router        = express.Router();
var jwtValidation = require('./../jwtValidation.js');
var api_room      = require('./../queries/api/query_room.js');

// Go to room selection
router.get('/rooms', function(req, res) {
	api_room.allRooms(function(results) {
		if (results.error) {
			res.send(results.error);
			return;
		}
		res.send(results);
	});
});

// Create a new room
router.post('/rooms', function(req, res) {
	api_room.createRoom(req.body.name, function(results) {
		if (results.error) {
			res.send(results.error);
			return;
		}
		res.send(results);
	});
});

// Go into an existing room
// otherwise, redirect to the room selection
router.get('/rooms/:id', function(req, res) {
	api_room.findRoom(req.params.id, function(results) {
		if (results.error) {
			res.send(results.error);
			return;
		}
		res.send(results);
		return;
	});
});

module.exports = router;
