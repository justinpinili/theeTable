var should          = require('should');
var request         = require('supertest');

var express         = require('express');
var bodyParser      = require('body-parser');
var routes          = require('./../../server/routes.js');
var schema          = require('./../../server/schema.js');
var theeTableServer = express();

theeTableServer.use(bodyParser.json());
theeTableServer.use('/', routes);

describe('/rooms API Endpoint', function() {

	before(function(done) {
		schema.Room.where({ name: "lobby2" }).findOne(function (err, room) {
			if (!err) {
				room.remove();
				done();
				return;
			}
			console.log(err);
			return;
		});
	});

  var body;
  var statusCode;

  describe('GET Request', function() {

    it("should return an existing room and it's corresponding information", function(done) {
      request(theeTableServer)
        .get('/rooms/lobby')
        .set('Accept', 'application/json')
        .expect(200)
        .expect(function(res) {
          body = res.body;
        })
        .end(function(err, res) {
          body.name.should.equal('lobby');
					should.exist(body.queue);
					should.exist(body.chat);
					should.exist(body.users);
          done();
        });
    });

		it("should return the user to the room lobby to choose an existing room", function(done) {
			request(theeTableServer)
				.get('/rooms/notlobby')
				.expect(function(res) {
          // statusCode = res.statusCode;
					body = res.body;
				})
				.end(function(err, res) {
          // statusCode.should.equal(302);
					body.message.should.equal("Room does not exist");
					done();
				});
		});

	});

	describe('POST Request', function() {

		it('should create and take you to a new room', function(done) {
			request(theeTableServer)
          .post('/rooms')
          .send({ name: 'lobby2' })
          .expect(function(res) {
            body = res.body;
          })
          .end(function(err, res) {
            should.exist(body.queue);
            should.exist(body.chat);
            should.exist(body.users);
						body.name.should.equal('lobby2');
            done();
          });
		});

		it('should notify you that the room already exists', function(done) {
			request(theeTableServer)
					.post('/rooms')
					.send({ name: 'lobby2' })
					.expect(function(res) {
						body = res.body;
					})
					.end(function(err, res) {
						body.message.should.equal("Room already exists. Please choose a different name.");
						done();
					});
		});

	});

});
