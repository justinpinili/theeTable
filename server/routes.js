module.exports = function(io) {

  var express = require('express');
  var create = require('./schema.js');
  var router = express.Router();

  var rooms = require('./routes/rooms.js')(io);
  var chat  = require('./routes/chat.js')(io);
  var queue = require('./routes/queue.js')(io);
  var user  = require('./routes/user.js')(io);

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
