var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = mongoose.Schema({
  name: {
          type: String,
          unique: true
        },

  // entries in the queue will be an object
  // ex. { source: 'url', title: 'title', artist: 'artist', length: 0 }
  queue: Array,

  // entries in the chat will be an object
  // (As of now, no timestamp is captured.)
  // ex. { username: username, msg: 'test', timestamp: '11241419000' }
  chat:  Array,

  // entries in the users will be strings
  // ex. 'justin'
  users: Array,

  currentDJ: String,

  currentSong: {},

  currentTime: Number

});

var userSchema = mongoose.Schema({

  username: {
              type: String,
              unique: true
            },

  password: String,

  upVotes:  Number,

  // entries in the playlist will be strings
  // ex. [ 'url', 'url2', 'url3' ]
  playlist: Array,

  // entries in the playlist will be strings
  // ex. [ 'url', 'url2', 'url3' ]
  favorites: Array

});

module.exports.Room = mongoose.model('Room', roomSchema);

module.exports.User = mongoose.model('User', userSchema);
