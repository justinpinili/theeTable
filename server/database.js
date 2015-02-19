var mongoose = require('mongoose');

var dbUrl = process.env.MONGOLAB_URI || 'mongodb://localhost/theeTable';

mongoose.connect(dbUrl);

module.exports.db = mongoose.connection;

module.exports.db.on('error', console.error.bind(console, 'connection error:'));

module.exports.db.once('open', function() {
  console.log("database connected!");
});
