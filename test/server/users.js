var should          = require('should');
var request         = require('supertest');
var theeTableServer = require('./../../app.js');

describe('/user API Endpoint', function() {

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
							console.log(res.body);
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
						.post('/chat')
						.send({
										user: 'justin',
										msg: 'test2'
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

		// describe('Log in a User', function() {
		//
		// 	it('should log in a new user upon valid verification', function(done) {
		// 		request(theeTableServer)
		// 				.post('/user/new')
		// 				.send({
		// 								username: 'justin',
		// 								password: 'test'
		// 							})
		// 				.expect(function(res) {
		// 					body = res.body;
		// 				})
		// 				.end(function(err, res) {
		// 					body.username.should.equal('justin');
		// 					body.upVotes.should.equal(0);
		// 					should.exist(body.playlist);
		// 					should.exist(body.favorites);
		// 					done();
		// 				});
		// 	});
		//
		// 	it('should not log in the user upon invalid verification', function(done) {
		// 		request(theeTableServer)
		// 				.post('/chat')
		// 				.send({
		// 								user: 'justin',
		// 								msg: 'nottest'
		// 							})
		// 				.expect(function(res) {
		// 					body = res.body;
		// 				})
		// 				.end(function(err, res) {
		// 					body.message.should.equal("Invalid login credentials. Please try again.");
		// 					done();
		// 				});
		// 	});
		//
		// });

	});

});
