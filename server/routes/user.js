var express = require('express');
var schema = require('./../schema.js');
var router = express.Router();

// Create a user
router.post('/user/new', function(req, res) {
	var newUser = new schema.User({
																	username: req.body.username,
																	password: req.body.password,
																	upVotes: 0,
																	playlist: [],
																	favorites: []
																});
	newUser.save(function (err) {
		if (err) {

			if (err.code === 11000) {
				res.send("User already exists. Please choose a different name.");
			} else {
				res.send(err);
			};

		} else {

			console.log('new user saved!');
			res.send(newUser);

		}
	});
});

// Log in a user
router.post('/user/login', function(req, res) {
	var searchUser  = schema.User.where({ username: req.body.username });
	searchUser.findOne(function (err, user) {
		if (err) {
			console.log(err);
		}

		if (user.password === req.body.password) {
			res.send(user);
		} else {
			res.send("Invalid login credentials. Please try again.");
		}
	});
});

module.exports = router;
