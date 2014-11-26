var express = require('express');
var create = require('./../schema.js');
var router = express.Router();

router.post('/user/new', function(req, res) {
	// Create a user
});

router.post('/user/login', function(req, res) {
	// Log in a user
});

module.exports = router;
