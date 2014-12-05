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

var io = require('socket.io-client');

var socketURL = 'http://localhost:1337';

var options = {
  transports: ['websocket'],
  'force new connection': true
};

var user1 = { room: 'lobby', user: 'justin' };
var user2 = { room: 'lobby', user: 'jason'  };
var user3 = { room: 'lobby', user: 'ashley' };

describe('socket.IO', function() {

	before(function(done) {
		done();
	});

	describe('users entering & leaving rooms', function() {

		it("should notify all users in a room that a new person has joined", function(done) {
			// var client1 = io.connect(socketURL, options);
			//
		  // client1.on('connect', function(data){
		  //   client1.emit('connection name', chatUser1);
			//
		  //   /* Since first client is connected, we connect
		  //   the second client. */
		  //   var client2 = io.connect(socketURL, options);
			//
		  //   client2.on('connect', function(data){
		  //     client2.emit('connection name', chatUser2);
		  //   });
			//
		  //   client2.on('new user', function(usersName){
		  //     usersName.should.equal(chatUser2.name + " has joined.");
		  //     client2.disconnect();
		  //   });
			//
		  // });
			//
		  // var numUsers = 0;
		  // client1.on('new user', function(usersName){
		  //   numUsers += 1;
			//
		  //   if(numUsers === 2){
		  //     usersName.should.equal(chatUser2.name + " has joined.");
		  //     client1.disconnect();
		  //     done();
		  //   }
		  // });
			done();
		});

	});

});
