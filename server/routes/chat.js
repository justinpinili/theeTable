var express = require('express');
var create = require('./../schema.js');
var router = express.Router();

router.get('/rooms', function(req, res) {
	// Go to room selection
	console.log('rooms');
});

router.post('/rooms', function(req, res) {
	// Create a new room
});

router.get('/rooms/:id', function(req, res) {
	// Go into an existing room
	// otherwise, redirect to the room selection
	console.log('rooms/'+req.params.id);
});

module.exports = router;
