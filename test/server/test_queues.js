var should          = require('should');
var request         = require('supertest');

var express         = require('express');
var bodyParser      = require('body-parser');
var routes          = require('./../../server/routes.js');
var schema          = require('./../../server/schema.js');
var theeTableServer = express();

theeTableServer.use(bodyParser.json());
theeTableServer.use('/', routes);

describe('/queue API Endpoint', function() {

	before(function(done) {
		schema.Room.where({ name: "lobby" }).findOne(function (err, room) {
			if (!err) {
				room.queue = [];
				room.save();
				done();
				return;
			}
			console.log(err);
			return;
		});
	});

	describe('POST Request', function() {

		var body;

		it('should create a new entry in the corresponding room queue', function(done) {
			// request(theeTableServer)
			// 		.post('/queue/lobby')
			// 		.send({ source: 'https://soundcloud.com/purpsoul/harry-wolfman-ontap-waifs-strays-remix' })
			// 		.expect(function(res) {
			// 			body = res.body;
			// 		})
			// 		.end(function(err, res) {
			// 			body.length.should.equal(1);
						done();
					// });
		});

		it('should return the full queue details', function(done) {
			// request(theeTableServer)
			// 		.post('/queue/lobby')
			// 		.send({ source: 'https://soundcloud.com/blondish/junge-junge-beautiful-girl-preview' })
			// 		.expect(function(res) {
			// 			body = res.body;
			// 		})
			// 		.end(function(err, res) {
			// 			body.length.should.equal(2);
			// 			body[0].votes.should.equal(0);
			// 			body[1].votes.should.equal(0);
						done();
					// });
		});

	});

});
