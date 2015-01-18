var express = require('express');
var schema  = require('./../schema.js');
var router  = express.Router();

var bcrypt        = require('bcrypt');
var jwt           = require('jsonwebtoken');
var keys          = require('./../securityKeys.js');
var jwtValidation = require('./../jwtValidation.js');

// Create a user
router.post('/user/new', function(req, res) {
	var newUser = new schema.User({
																	username: req.body.username,
																	password: req.body.password,
																	upVotes: 0,
																	playlist: [],
																	favorites: []
																});
	var bcrypt = require('bcrypt');
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(req.body.password, salt, function(err, hash) {
				if (!err) {
					newUser.password = hash;
					newUser.save(function (err) {
						if (!err) {
							// console.log('new user saved!');
							var jwt_token = jwt.sign({ id: newUser.username }, keys.jwtSecretKey);
	            res.send({jwt: jwt_token});
							// res.send(newUser);
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
					return;
				}
				console.log(err);
				res.send(err);
				return;
	    });
	});
});

// Get user info
router.get('/user', jwtValidation, function(req, res) {
	schema.User.where({ username: req.query.id }).findOne(function(err, user) {
		if (!err) {
			if (user === null) {
				res.send({ message: "No user found with the given username." });
				return;
			}
			var userInfo       = {};
			userInfo.username  = user.username;
			userInfo.upVotes   = user.upVotes;
			userInfo.playlist  = user.playlist;
			userInfo.favorites = user.favorites;
			res.send(userInfo);
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
			bcrypt.compare(req.body.password, user.password, function(err, result) {
				if (!err) {
					if (result) {
						// console.log("password matched! logged in!");
						var jwt_token = jwt.sign({ id: user.username }, keys.jwtSecretKey);
						res.send({jwt: jwt_token});
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
			return;
		}
		console.log(err);
		res.send(err);
		return;
	});
});

module.exports = router;
