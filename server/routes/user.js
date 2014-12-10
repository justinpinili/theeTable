var express = require('express');
var schema  = require('./../schema.js');
var router  = express.Router();

var bcrypt  = require('bcrypt');
var jwt     = require('jsonwebtoken');

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
		if (!err) {
			// console.log('new user saved!');
			res.send(newUser);
			return;
		}
		if (err.code === 11000) {
			res.send({ message: "User already exists. Please choose a different name." });
			return;
		}
		console.log(err);
		res.send(err);
		return;
	});
});

// Log in a user
router.post('/user/login', function(req, res) {
	schema.User.where({ username: req.body.username }).findOne(function (err, user) {
		if (!err) {
			if (user === null) {
				res.send({ message: "No user found with the given username." });
				return;
			}
			if (user.password === req.body.password) {
				// console.log("password matched! logged in!");
				res.send(user);
				return;
			} else {
				res.send({ message: "Invalid login credentials. Please try again." });
				return;
			}
		}
		console.log(err);
		res.send(err);
		return;
	});
});

module.exports = router;
