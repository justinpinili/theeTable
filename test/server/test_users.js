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
			if (!err && user !== null) {
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
			done();
			return;
		});
	});

	after(function(done) {
		var song1 = { source: 'https://soundcloud.com/blondish/junge-junge-beautiful-girl-preview',
		title: 'Junge Junge - Beautiful Girl (Blondish Remix Preview)', votes: 0 };
		var song2 = { source: 'https://soundcloud.com/purpsoul/harry-wolfman-ontap-waifs-strays-remix',
		title: 'Harry Wolfman - OnTap Waifs & Strays Remix', votes: 0 };
		var song3 = { source: 'https://soundcloud.com/eskimorecordings/nteibint-feat-birsen-riptide',
		title: 'NTEIBINT feat. Birsen - Riptide', votes: 0 };
		var song4 = { source: 'https://soundcloud.com/mixmag-1/premiere-steve-lawler-house-record',
		title: "Premiere: Steve Lawler 'House Record'", votes: 0 };
		var song5 = { source: 'https://soundcloud.com/kunsthandwerk/khw009-sandro-golia-galatone',
		title: 'KHW009 - Sandro Golia - Galatone (HRRSN Remix) [Cut]', votes: 0 };
		var song6 = { source: 'https://soundcloud.com/fatcat-demo/teso-wo-to-step',
		title: 'T.e.s.o - Wo To Step', votes: 0 };

		var emptyRoom = function() {
			schema.Room.where({ name: "lobby" }).findOne(function (err, room) {
				if (!err && room !== null) {
					room.chat = [];
					room.users = [];
					room.queue = [];
					room.currentDJ = null;
					room.currentSong = null;
					room.currentTime = null;
					room.save(function(err, room) {
						if (!err) {
							schema.User.where({ username: "justin"}).findOne(function(err, user) {
								if (!err) {
									user.playlist = [song1, song2, song3];
									user.save(function(err) {
										if (!err) {
											schema.User.where({ username: "jason"}).findOne(function(err, user) {
												if (!err) {
													user.playlist = [song4, song5, song6];
													user.save(function(err) {
														if (!err) {
															mongoose.disconnect(function() {
																done();
																return;
															});
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
							return;
						}
						// console.log(err);
						emptyRoom();
						return;
					});
					return;
				}
				console.log(err);
				return;
			});
		};
		emptyRoom();
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
