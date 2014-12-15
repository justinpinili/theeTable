var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/theeTable');

module.exports.db = mongoose.connection;

module.exports.db.on('error', console.error.bind(console, 'connection error:'));

module.exports.db.once('open', function() {
  console.log("database connected!");
});
