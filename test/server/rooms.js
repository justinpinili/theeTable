var should       = require('should');
var request      = require('supertest');

describe('/rooms API Endpoint', function() {

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
          statusCode = res.statusCode;
				})
				.end(function(err, res) {
          statusCode.should.equal(302);
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
            statusCode = res.statusCode;
          })
          .end(function(err, res) {
            statusCode.should.equal(302);
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
