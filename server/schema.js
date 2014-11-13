var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var roomSchema = mongoose.Schema({
  name:  String,
  queue: Array,
  chat:  Array
});

var userSchema = mongoose.Schema({
  username: String,
  upVotes:  Number
});

module.exports.Room = mongoose.model('Room', roomSchema);
module.exports.User = mongoose.model('User', userSchema);
