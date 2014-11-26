// var should          = require('should');
// var request         = require('supertest');
// var theeTableServer = require('./../testServer.js');
//
// describe('/chat API Endpoint', function() {
//
// 	describe('POST Request', function() {
//
// 		var body;
//
// 		it('should create a new entry in the corresponding room chat', function(done) {
// 			request(theeTableServer)
// 					.post('/chat')
// 					.send({
// 									user: 'justin',
// 									msg: 'test'
// 								})
// 					.expect(function(res) {
// 						body = res.body;
// 					})
// 					.end(function(err, res) {
// 						body.length.should.equal(1);
// 						body[0].user.should.equal('justin');
// 						body[0].msg.should.equal('test');
// 						done();
// 					});
// 		});
//
// 		it('should return the full chat details', function(done) {
// 			request(theeTableServer)
// 					.post('/chat')
// 					.send({
// 									user: 'jason',
// 									msg: 'test2'
// 								})
// 					.expect(function(res) {
// 						body = res.body;
// 					})
// 					.end(function(err, res) {
// 						body.length.should.equal(2);
// 						body[1].user.should.equal('jason');
// 						body[1].msg.should.equal('test2');
// 						done();
// 					});
// 		});
//
// 	});
//
// });
