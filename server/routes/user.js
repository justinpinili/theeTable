var express       = require('express');
var router        = express.Router();
var jwtValidation = require('./../jwtValidation.js');
var api_user      = require('./../queries/api/query_user.js');

// Create a user
router.post('/user/new', function(req, res) {
	api_user.createUser(req.body.username, req.body.password, req.body.accessToken, function(results) {
		if (results.error) {
			res.send(results.error);
			return;
		}
		res.send(results);
		return;
	});
});

// Get user info
router.get('/user', jwtValidation, function(req, res) {
	api_user.getUser(req.query.id, function(results) {
		if (results.error) {
			res.send(results.error);
			return;
		}
		res.send(results);
		return;
	});
});

// Log in a user
router.post('/user/login', function(req, res) {
	api_user.loginUser(req.body.username, req.body.password, req.body.accessToken, function(results) {
		if (results.error) {
			res.send(results.error);
			return;
		}
		res.send(results);
		return;
	});
});

module.exports = router;
