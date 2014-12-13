var should          = require('should');
var request         = require('supertest');

var express         = require('express');
var bodyParser      = require('body-parser');
var mongoose        = require('mongoose');
var routes          = require('./../../server/routes.js');
var schema          = require('./../../server/schema.js');
var theeTableServer = express();

theeTableServer.use(bodyParser.json());
theeTableServer.use('/', routes);

describe('/user API Endpoint', function() {

	before(function(done) {
		schema.User.where({ username: "justin" }).findOne(function (err, user) {
			if (!err) {
				user.remove();
				schema.User.where({ username: "jason" }).findOne(function (err, user) {
					if (!err) {
						user.remove();
						done();
						return;
					}
					console.log(err);
					return;
				});
				return;
			}
			console.log(err);
			return;
		});
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
							should.exist(body.jwt);
							done();
						});
			});

			it('should create another new user entry', function(done) {
				request(theeTableServer)
						.post('/user/new')
						.send({
										username: 'jason',
										password: 'test'
									})
						.expect(function(res) {
							// console.log(res.body);
							body = res.body;
						})
						.end(function(err, res) {
							should.exist(body.jwt);
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
							should.exist(body.jwt);
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

	describe('GET Request', function() {

		describe('Getting User Info', function() {

			it('should obtain user information', function(done) {
				request(theeTableServer)
						.get('/user?jwt_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Imp1c3RpbiIsImlhdCI6MTQxODI0OTc3N30.2SZoGIcsPaQjnulJHIjKtVhpiea6sDB-UiZUxr-XRGs')
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

			it('should not allow access to the API without JWT', function(done) {
				request(theeTableServer)
						.get('/user')
						.expect(function(res) {
							// console.log(res.body);
							body = res.body;
						})
						.end(function(err, res) {
							body.message.should.equal("You are not allowed to access this API");
							done();
						});
			});

		});

	});
});
