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

describe('/rooms API Endpoint', function() {

	before(function(done) {
		db.once('open', function() {
			schema.Room.where({ name: "lobby2" }).findOne(function (err, room) {
				if (!err && room !== null) {
					room.remove();

					schema.Room.where({ name: "lobby" }).findOne(function (err, room) {
						if (!err && room !== null) {
							room.users = [];
							room.chat = [];
							room.save();
							done();
							return;
						}
						console.log(err);
						return;
					})

					return;
				}
				console.log(err);
				done();
				return;
			});
		});
	});

  var body;
  var statusCode;

  describe('GET Request', function() {

    it("should return an existing room and it's corresponding information", function(done) {
      request(theeTableServer)
        .get('/rooms/lobby?jwt_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Imp1c3RpbiIsImlhdCI6MTQxODI0OTc3N30.2SZoGIcsPaQjnulJHIjKtVhpiea6sDB-UiZUxr-XRGs')
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
				.get('/rooms/notlobby?jwt_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Imp1c3RpbiIsImlhdCI6MTQxODI0OTc3N30.2SZoGIcsPaQjnulJHIjKtVhpiea6sDB-UiZUxr-XRGs')
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

		it("should not allow access to the API without JWT", function(done) {
			request(theeTableServer)
				.get('/rooms/notlobby')
				.expect(function(res) {
					// statusCode = res.statusCode;
					body = res.body;
				})
				.end(function(err, res) {
					// statusCode.should.equal(302);
					body.message.should.equal("You are not allowed to access this API");
					done();
				});
		});

	});

	describe('POST Request', function() {

		it('should create and take you to a new room', function(done) {
			request(theeTableServer)
          .post('/rooms?jwt_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Imp1c3RpbiIsImlhdCI6MTQxODI0OTc3N30.2SZoGIcsPaQjnulJHIjKtVhpiea6sDB-UiZUxr-XRGs')
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
					.post('/rooms?jwt_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Imp1c3RpbiIsImlhdCI6MTQxODI0OTc3N30.2SZoGIcsPaQjnulJHIjKtVhpiea6sDB-UiZUxr-XRGs')
					.send({ name: 'lobby2' })
					.expect(function(res) {
						body = res.body;
					})
					.end(function(err, res) {
						body.message.should.equal("Room already exists. Please choose a different name.");
						done();
					});
		});

		it("should not allow access to the API without JWT", function(done) {
			request(theeTableServer)
				.post('/rooms')
				.send({ name: 'lobby3' })
				.expect(function(res) {
					// statusCode = res.statusCode;
					body = res.body;
				})
				.end(function(err, res) {
					// statusCode.should.equal(302);
					body.message.should.equal("You are not allowed to access this API");
					done();
				});
		});

	});

});
