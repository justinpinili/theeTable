var should          = require('should');
var request         = require('supertest');

var express         = require('express');
var bodyParser      = require('body-parser');
var mongoose        = require('mongoose');
var routes          = require('./../../server/routes.js');
var schema          = require('./../../server/schema.js');
var app = express();

app.use(bodyParser.json());
app.use('/', routes);


var theeTableServer = require('http').Server(app);
var server_io = require('socket.io').listen(1338);
var socketIO = require('./../../server/routes/socketIO.js')(server_io);

var client_io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:1338';

var options = {
  transports: ['websocket'],
  'force new connection': true
};

var user1 = { room: 'lobby', user: 'justin' };
var user2 = { room: 'lobby', user: 'jason'  };

var message = { msg: 'oh herro' };
var song1 = { source: 'https://soundcloud.com/blondish/junge-junge-beautiful-girl-preview'};
var song2 = { source: 'https://soundcloud.com/purpsoul/harry-wolfman-ontap-waifs-strays-remix'};
var song3 = { source: 'https://soundcloud.com/eskimorecordings/nteibint-feat-birsen-riptide'};
var song4 = { source: 'https://soundcloud.com/mixmag-1/premiere-steve-lawler-house-record'};
var song5 = { source: 'https://soundcloud.com/kunsthandwerk/khw009-sandro-golia-galatone'};
var song6 = { source: 'https://soundcloud.com/fatcat-demo/teso-wo-to-step'};

describe('socket.IO', function() {

	before(function(done) {
    schema.Room.where({ name: "lobby" }).findOne(function (err, room) {
      if (!err && room !== null) {
        room.users = [];
        room.save();
        done();
        return;
      }
      console.log(err);
      return;
    })
	});

  after(function(done) {
    schema.Room.where({ name: "lobby" }).findOne(function (err, room) {
      if (!err && room !== null) {
        room.chat.pop();
        room.users = [];
        room.save();

        mongoose.disconnect(function() {
          done();
        });
        return;
      }
      console.log(err);
      return;
    })
  });

	describe('users entering & leaving rooms', function() {

		it("should notify all users in a room that a new person has joined", function(done) {
			var client1 = client_io.connect(socketURL, options);

		  client1.on('connect', function(data){
        // console.log("connected");
		    client1.emit('roomEntered', user1);

		    /* Since first client is connected, we connect
		    the second client. */
		    var client2 = client_io.connect(socketURL, options);

		    client2.on('connect', function(data){
		      client2.emit('roomEntered', user2);
		    });

		    client2.on('usersInRoom', function(room){
		      room.users.length.should.equal(2);
          room.users[0].should.equal('justin');
          room.users[1].should.equal('jason');
		      client2.disconnect();
          client1.disconnect();
          done();
		    });

		  });

		});

    it("should notify all users in a room that a new person has left", function(done) {
      var client1 = client_io.connect(socketURL, options);

      client1.on('connect', function(data){
        // console.log("connected");
        client1.emit('roomEntered', user1);

        /* Since first client is connected, we connect
        the second client. */
        var client2 = client_io.connect(socketURL, options);

        client2.on('connect', function(data){
          client2.emit('roomEntered', user2);
          client2.disconnect();
        });

        client1.on('usersInRoom', function(room){
          room.users.length.should.equal(1);
          room.users[0].should.equal('justin');
          client1.disconnect();
          done();
        });

      });

    });

  });

  describe('users sending chat messages', function() {

    it("should notify all users in a room that a new chat message exists", function(done) {
      var client1 = client_io.connect(socketURL, options);

      client1.on('connect', function(data){
        // console.log("connected");
        client1.emit('roomEntered', user1);

        /* Since first client is connected, we connect
        the second client. */
        var client2 = client_io.connect(socketURL, options);

        client2.on('connect', function(data){
          client2.emit('roomEntered', user2);
          client2.emit('newChatMessage', message);
        });

        client1.on('updatedChat', function(data) {
          // console.log(data);
          data.chat.length.should.equal(3);
          data.chat[2].user.should.equal('jason');
          client2.disconnect();
          client1.disconnect();
          done();
        });

      });

    });

  });

  describe("users playlist", function() {

    it("should add new songs to a user's playlist", function(done) {
      var client1 = client_io.connect(socketURL, options);

      var client2 = client_io.connect(socketURL, options);

      client2.on('connect', function(data) {
        client2.emit('roomEntered', user2);
        client2.emit('newPlaylistItem', song1);
        setTimeout(function() {
          client2.emit('newPlaylistItem', song2);
        }, 100);
        setTimeout(function() {
          client2.emit('newPlaylistItem', song3);
        }, 200);
      });
      
      client1.on('connect', function(data){
        // console.log("connected");
        client1.emit('roomEntered', user1);

        client1.emit('newPlaylistItem', song4);
        setTimeout(function() {
          client1.emit('newPlaylistItem', song5);
        }, 100);
        setTimeout(function() {
          client1.emit('newPlaylistItem', song6);
        }, 200);


        client1.on('updatedPlaylist', function(data) {
          if (data.playlist[ data.playlist.length-1 ].source === 'https://soundcloud.com/fatcat-demo/teso-wo-to-step') {
            // console.log(data);
            data.playlist.length.should.equal(3);
            client1.disconnect();
            done();
          }
        });
      });
    });

    // it("should move the song to the end of the playlist once the song is finished", function(done) {
    //
    // });

  });

  // describe('users in dj rotation', function() {
  //
  //   it("should move the user to the back of the queue after the song is finished", function(done) {
  //
  //   });
  //
  //   it("should notify all users the next user to play a song", function(done) {
  //
  //   });
  //
  // });

});
