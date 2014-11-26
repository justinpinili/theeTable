var express = require('express');
var create = require('./../schema.js');
var router = express.Router();

router.post('/chat/:id', function(req, res) {
	// Add message to the messages
});

module.exports = router;
