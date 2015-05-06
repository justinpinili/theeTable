var schema = require('./../../schema.js');
var bcrypt = require('bcrypt');
var jwt    = require('jsonwebtoken');
var keys   = require('./../../securityKeys.js');

var loginTime = function() {
	var d = new Date();
	return d.getTime();
}

// Create a user
module.exports.createUser = function(username, password, accessToken, scID, callback) {
	var newUser = new schema.User({
		username: username,
		password: password,
		upVotes: 0,
		playlist: [],
		loginTime: loginTime(),
		accessToken: accessToken,
		scID: scID
	});
	var bcrypt = require('bcrypt');
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(password, salt, function(err, hash) {
			if (!err) {
				newUser.password = hash;
				newUser.save(function (err) {
					if (!err) {
						// console.log('new user saved!');
						var jwt_token = jwt.sign({ id: newUser.username }, keys.jwtSecretKey);
						callback({ jwt: jwt_token });
						return;
					}
					if (err.code === 11000) {
						callback({ message: "User already exists. Please choose a different name." });
						return;
					}
					console.log(err);
					callback({ error: err });
					return;
				});
				return;
			}
			console.log(err);
			callback({ error: err });
			return;
		});
	});
};

// Query for an existing user
module.exports.getUser = function(id, callback) {
	schema.User.where({ username: id }).findOne(function(err, user) {
		if (!err) {
			if (user === null) {
				callback({ message: "No user found with the given username." });
				return;
			}
			var userInfo         = {};
			userInfo.username    = user.username;
			userInfo.upVotes     = user.upVotes;
			userInfo.playlist    = user.playlist;
			userInfo.loginTime   = user.loginTime;
			userInfo.accessToken = user.accessToken;
			userInfo.scID        = user.scID;
			callback(userInfo);
			return;
		}
		console.log(err);
		callback({ error: err });
		return;
	});
};

// Login an existing user
module.exports.loginUser = function(username, password, accessToken, scID, callback) {
	schema.User.where({ username: username }).findOne(function (err, user) {
		if (!err) {
			if (user === null) {
				callback({ message: "No user found with the given username." });
				return;
			}
			bcrypt.compare(password, user.password, function(err, result) {
				if (!err) {
					if (result) {
						// console.log("password matched! logged in!");
						user.loginTime = loginTime();
						user.accessToken = accessToken;
						user.save(function(err) {
							if (!err) {
								var jwt_token = jwt.sign({ id: user.username, accessToken: accessToken }, keys.jwtSecretKey);
								callback({jwt: jwt_token});
								return;
							}
							console.log(err);
							callback({ error: err });
							return;
						});
						return;
					} else {
						callback({ message: "Invalid login credentials. Please try again." });
						return;
					}
				}
				console.log(err);
				callback({ error: err });
				return;
			});
			return;
		}
		console.log(err);
		callback({ error: err });
		return;
	});
};
