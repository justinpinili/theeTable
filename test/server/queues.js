var should       = require('should');
var request      = require('supertest');

describe('/queue API Endpoint', function() {

	describe('POST Request', function() {

		it('should create a new entry in the corresponding room queue', function(done) {
			request(theeTableServer)
					.post('/queue')
					.send({ source: 'http://youtu.be/oEm3lY3trRU' })
					.expect(function(res) {
						body = res.body;
					})
					.end(function(err, res) {
						body.length.should.equal(1);
						done();
					});
		});

		it('should return the full queue details', function(done) {
			request(theeTableServer)
					.post('/queue')
					.send({ source: 'http://youtu.be/0M4nKru2H_Q' })
					.expect(function(res) {
						body = res.body;
					})
					.end(function(err, res) {
						body.length.should.equal(2);
						body[0].votes.should.equal(0);
						body[1].votes.should.equal(0);
						done();
					});
		});

	});

});
