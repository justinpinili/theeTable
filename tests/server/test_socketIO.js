var should          = require('should');
var mongoose        = require('mongoose');
var schema          = require('./../../server/schema.js');

var server_io = require('socket.io').listen(1338);
var socketIO = require('./../../server/routes/socketIO.js')(server_io);

var client_io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:1338';

var options = {
  transports: ['websocket'],
  'force new connection': true
};

var user1 = { roomName: 'lobby', user: 'justin' };
var user2 = { roomName: 'lobby', user: 'jason'  };

var message = { msg: 'oh herro' };

var song1 = { source: 'https://soundcloud.com/blondish/junge-junge-beautiful-girl-preview',
              title: 'Junge Junge - Beautiful Girl (Blondish Remix Preview)',
              artist: 'Blondish',
              length: 133080,
              soundcloudID: 1};

var song2 = { source: 'https://soundcloud.com/purpsoul/harry-wolfman-ontap-waifs-strays-remix',
              title: 'Harry Wolfman - OnTap Waifs & Strays Remix',
              artist: 'Purpsoul',
              length: 397960,
              soundcloudID: 2 };

var song3 = { source: 'https://soundcloud.com/eskimorecordings/nteibint-feat-birsen-riptide',
              title: 'NTEIBINT feat. Birsen - Riptide',
              artist: 'Eskimo Recordings',
              length: 335678,
              soundcloudID: 3 };

var song4 = { source: 'https://soundcloud.com/mixmag-1/premiere-steve-lawler-house-record',
              title: "Premiere: Steve Lawler 'House Record'",
              artist: 'Mixmag-1',
              length: 317233,
              soundcloudID: 4 };

var song5 = { source: 'https://soundcloud.com/kunsthandwerk/khw009-sandro-golia-galatone',
              title: 'KHW009 - Sandro Golia - Galatone (HRRSN Remix) [Cut]',
              artist: "kunsthandwerk",
              length: 180078,
              soundcloudID: 5 };

var song6 = { source: 'https://soundcloud.com/fatcat-demo/teso-wo-to-step',
              title: 'T.e.s.o - Wo To Step',
              artist: 'Fatcat Demo',
              length: 269478,
              soundcloudID: 6 };

var dj1 = { user: 'justin' };
var dj2 = { user: 'jason' };

var rotation1 = { queue: ['jason', 'justin'] };

describe('socket.IO', function() {

	before(function(done) {
    schema.Room.where({ name: "lobby" }).findOne(function (err, room) {
      if (!err && room !== null) {
        room.users = [];
        room.queue = [];
        room.save();
        schema.User.where({ username: "justin"}).findOne(function(err, user) {
          if (!err) {
            user.playlist = [];
            user.save(function(err) {
              if (!err) {
                schema.User.where({ username: "jason"}).findOne(function(err, user) {
                  if (!err) {
                    user.playlist = [];
                    user.save(function(err) {
                      if (!err) {
                        done();
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
      console.log(err);
      return;
    })
	});

  after(function(done) {
    server_io.close();
    done();
  });

	describe('users entering & leaving rooms', function() {

		it("should notify all users in a room that a new person has joined", function(done) {
			var client1 = client_io.connect(socketURL, options);

		  client1.on('connect', function(data){

		    client1.emit('roomEntered', user1);

		    /* Since first client is connected, we connect
		    the second client. */
		    var client2 = client_io.connect(socketURL, options);

		    client2.on('connect', function(data){
		      client2.emit('roomEntered', user2);
		    });

        client2.on('disconnect', function() {
          client1.on('disconnect', function() {
            done();
          });
        });

		    client2.on('usersInRoom', function(room){
		      room.users.length.should.equal(2);
          room.users[0].should.equal('justin');
          room.users[1].should.equal('jason');
		      client2.disconnect();
          client1.disconnect();
		    });

		  });

		});

    it("should notify all users in a room that a new person has left", function(done) {
      var client1 = client_io.connect(socketURL, options);

      client1.on('connect', function(data){

        client1.emit('roomEntered', user1);

        /* Since first client is connected, we connect
        the second client. */
        var client2 = client_io.connect(socketURL, options);

        client2.on('connect', function(data){
          client2.emit('roomEntered', user2);
          client2.disconnect();
        });

        client2.on('disconnect', function() {
          client1.on('disconnect', function() {
            done();
          });
        });

        client1.on('usersInRoom', function(room){
          room.users.length.should.equal(1);
          room.users[0].should.equal('justin');
          client1.disconnect();
        });

      });

    });

  });

  describe('users sending chat messages', function() {

    it("should notify all users in a room that a new chat message exists", function(done) {
      var client1 = client_io.connect(socketURL, options);

      client1.on('connect', function(data){

        client1.emit('roomEntered', user1);

        /* Since first client is connected, we connect
        the second client. */
        var client2 = client_io.connect(socketURL, options);

        client2.on('connect', function(data){
          client2.emit('roomEntered', user2);
          setInterval(function() {
            client2.emit('newChatMessage', message);
          }, 1000);
        });

        client2.on('disconnect', function() {
          client1.on('disconnect', function() {
            done();
          });
        });

        client1.on('updatedChat', function(data) {
          if (data.chat.length > 2) {
            data.chat.length.should.equal(3);
            data.chat[2].user.should.equal('jason');
            client2.disconnect();
            client1.disconnect();
          }
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
        client2.emit('newPlaylistItem', { song: song1 });
        setTimeout(function() {
          client2.emit('newPlaylistItem', { song: song2 });
        }, 100);
        setTimeout(function() {
          client2.emit('newPlaylistItem', { song: song3 });
        }, 200);
      });

      client2.on('disconnect', function() {
        client1.on('disconnect', function() {
          done();
        });
      });

      client1.on('connect', function(data){
        client1.emit('roomEntered', user1);

        client1.emit('newPlaylistItem', { song: song4 });
        setTimeout(function() {
          client1.emit('newPlaylistItem', { song: song5 });
        }, 100);
        setTimeout(function() {
          last = true;
          client1.emit('newPlaylistItem', { song: song6 });
        }, 200);


        client1.on('updatedPlaylist', function(data) {
          if (data.playlist[ data.playlist.length-1 ].title === 'T.e.s.o - Wo To Step') {
            data.playlist.length.should.equal(3);
            client2.disconnect();
            client1.disconnect();
          }
        });
      });
    });

  });

  describe('users in room queue', function() {

    it("should notify all users the new rotation of DJs after someone joins the rotation", function(done) {
      var client1 = client_io.connect(socketURL, options);

      client1.on('connect', function(data){

        client1.emit('roomEntered', user1);

        var client2 = client_io.connect(socketURL, options);

        client2.on('connect', function(data) {
          client2.emit('roomEntered', user2);
          client2.emit('addToQueue', dj2);
        });

        client2.on('disconnect', function() {
          client1.on('disconnect', function() {
            done();
          });
        });

        setTimeout(function() {
          client1.emit('addToQueue', dj1);
        }, 100);


        client1.on('updatedQueue', function(data) {
          if (data.queue[ data.queue.length-1 ] === 'justin') {
            data.queue.length.should.equal(2);
            data.queue[0].should.equal('jason');
            client2.disconnect();
            client1.disconnect();
          }
        });
      });
    });

    it("should notify all users the new rotation of DJs after a song is finished", function(done) {
      var client1 = client_io.connect(socketURL, options);

      client1.on('connect', function(data){

        client1.emit('roomEntered', user1);

        var client2 = client_io.connect(socketURL, options);

        client2.on('connect', function(data) {
          client2.emit('roomEntered', user2);
          client2.emit('addToQueue', dj2);
          client2.on('updatedQueue', function(data) {
            if (data.queue[ data.queue.length-1 ] === 'justin') {
              // let's assume the currentDJ is done with the song
              client2.emit('newQueue', rotation1);
            }
          });
        });

        client2.on('disconnect', function() {
          client1.on('disconnect', function() {
            done();
          });
        });

        setTimeout(function() {
          client1.emit('addToQueue', dj1);
        }, 100);


        client1.on('rotatedQueue', function(data) {
          data.queue.length.should.equal(2);
          data.queue[0].should.equal('justin');
          data.currentDJ.should.equal('justin');
          data.currentSong.source.should.equal('https://soundcloud.com/mixmag-1/premiere-steve-lawler-house-record');
          should.equal(data.currentTime, 0);
          client2.disconnect();
          client1.disconnect();
        });
      });
    });

    it("should rotate the top song to the bottom of a user's playlist after the song is finished", function(done) {
      var client1 = client_io.connect(socketURL, options);

      client1.on('connect', function(data){

        client1.emit('roomEntered', user1);

        setTimeout(function() {
          client1.emit('addToQueue', dj1);
        }, 100);

        client1.on('rotatedQueue', function(data) {
          client2.emit('updatePlaylist', { username: 'jason' });
        });

        var client2 = client_io.connect(socketURL, options);

        client2.on('connect', function(data) {
          client2.emit('roomEntered', user2);
          client2.emit('addToQueue', dj2);
        });

        client2.on('disconnect', function() {
          client1.on('disconnect', function() {
            done();
          });
        });

        client2.on('updatedQueue', function(data) {
          if (data.queue[ data.queue.length-1 ] === 'justin') {
            // let's assume the currentDJ is done with the song
            client2.emit('newQueue', rotation1);
          }
        });

        client2.on('rotatedPlaylist', function(data) {
          data.playlist[0].source.should.equal("https://soundcloud.com/purpsoul/harry-wolfman-ontap-waifs-strays-remix");
          client2.disconnect();
          client1.disconnect();
        });

      });
    });

    it("should notify current time of current song being played in the room", function(done) {
      var client1 = client_io.connect(socketURL, options);
      var called = false;
      client1.on('connect', function(data){
        client1.emit('roomEntered', user1);
        client1.emit('addToQueue', dj1);
        client1.on('updatedQueue', function(data) {
          if (!called) {
            client1.emit('currentTime', {time: 200});
            called = true;
          }
        });

        client1.on('disconnect', function() {
          done();
        });

        client1.on('updatedCurrentTime', function(data) {
          data.time.should.equal(200);
          client1.disconnect();
        });
      });
    });

  });

});
