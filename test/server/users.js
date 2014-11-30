var should          = require('should');
var request         = require('supertest');

var express         = require('express');
var bodyParser      = require('body-parser');
var mongoose        = require('mongoose');
var routes          = require('./../../server/routes.js');
var schema          = require('./../../server/schema.js');
var theeTableServer = express();

// mongoose.connect('mongodb://localhost/theeTable');
// var db = mongoose.connection;

theeTableServer.use(bodyParser.json());
theeTableServer.use('/', routes);

describe('/user API Endpoint', function() {

	before(function(done) {
		// db.once('open', function() {
			// console.log("database connected!");
			schema.User.where({ username: "justin" }).findOne(function (err, user) {
				if (!err) {
					user.remove();
					done();
					return;
				}
				console.log(err);
				return;
			});
		// });
	});

	after(function(done) {
	  // mongoose.disconnect(function() {
			done();
		// });
	});

	describe('POST Request', function() {

		var body;

		describe('Creating New User', function() {

			it('should create a new user entry', function(done) {
				request(theeTableServer)
						.post('/user/new')
						.send({
										username: 'justin',
										password: 'test'
									})
						.expect(function(res) {
							// console.log(res.body);
							body = res.body;
						})
						.end(function(err, res) {
							body.username.should.equal('justin');
							body.upVotes.should.equal(0);
							should.exist(body.playlist);
							should.exist(body.favorites);
							done();
						});
			});

			it('should let the user know that username already exists', function(done) {
				request(theeTableServer)
						.post('/user/new')
						.send({
										username: 'justin',
										password: 'test2'
									})
						.expect(function(res) {
							body = res.body;
						})
						.end(function(err, res) {
							body.message.should.equal("User already exists. Please choose a different name.");
							done();
						});
			});

		});

		describe('Log in a User', function() {

			it('should log in a new user upon valid verification', function(done) {
				request(theeTableServer)
						.post('/user/login')
						.send({
										username: 'justin',
										password: 'test'
									})
						.expect(function(res) {
							body = res.body;
						})
						.end(function(err, res) {
							body.username.should.equal('justin');
							body.upVotes.should.equal(0);
							should.exist(body.playlist);
							should.exist(body.favorites);
							done();
						});
			});

			it('should not log in the user upon invalid verification', function(done) {
				request(theeTableServer)
						.post('/user/login')
						.send({
										username: 'justin',
										password: 'nottest'
									})
						.expect(function(res) {
							body = res.body;
						})
						.end(function(err, res) {
							body.message.should.equal("Invalid login credentials. Please try again.");
							done();
						});
			});

		});

	});

});
