var should          = require('should');
var request         = require('supertest');

var express         = require('express');
var bodyParser      = require('body-parser');
var mongoose        = require('mongoose');
var routes          = require('./../../server/routes.js');
var schema          = require('./../../server/schema.js');
var theeTableServer = express();

mongoose.connect('mongodb://localhost/theeTable');
var db = mongoose.connection;

theeTableServer.use(bodyParser.json());
theeTableServer.use('/', routes);

describe('/chat API Endpoint', function() {

	before(function(done) {
		db.once('open', function() {
			schema.Room.where({ name: "lobby" }).findOne(function (err, room) {
				if (!err) {
					room.chat = [];
					room.save();
					done();
					return;
				}
				console.log(err);
				return;
			});
		});

	});

	describe('POST Request', function() {

		var body;

		it('should create a new entry in the corresponding room chat', function(done) {
			request(theeTableServer)
					.post('/chat/lobby')
					.send({
									user: 'justin',
									msg: 'testing'
								})
					.expect(function(res) {
						body = res.body;
					})
					.end(function(err, res) {
						body.length.should.equal(1);
						body[0].user.should.equal('justin');
						body[0].msg.should.equal('testing');
						done();
					});
		});

		it('should return the full chat details', function(done) {
			request(theeTableServer)
					.post('/chat/lobby')
					.send({
									user: 'jason',
									msg: 'test2'
								})
					.expect(function(res) {
						body = res.body;
					})
					.end(function(err, res) {
						body.length.should.equal(2);
						body[1].user.should.equal('jason');
						body[1].msg.should.equal('test2');
						done();
					});
		});

	});

});
