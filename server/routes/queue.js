var express = require('express');
var create = require('./../schema.js');
var router = express.Router();

router.post('/queue/:id', function(req, res) {
	// Add song to the queue
	// return full queue back to the client
});

module.exports = router;
