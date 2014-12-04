module.exports = function(io) {

  var express = require('express');
  var create = require('./schema.js');
  var router = express.Router();

  var rooms = require('./routes/rooms.js');
  var chat  = require('./routes/chat.js');
  var queue = require('./routes/queue.js');
  var user  = require('./routes/user.js');
  var socketIO  = require('./routes/socketIO.js')(io);

  // Front End
  router.get('/', function(req, res) {
    res.render('index');
  });

  router.use(rooms);
  router.use(chat);
  router.use(queue);
  router.use(user);

  return router;

}
