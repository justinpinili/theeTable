
  var express = require('express');
  var create = require('./schema.js');
  var router = express.Router();

  var rooms = require('./routes/rooms.js');
  var chat  = require('./routes/chat.js');
  var queue = require('./routes/queue.js');
  var user  = require('./routes/user.js');

  // Front End
  router.get('/', function(req, res) {
    res.render('index');
  });

  router.use(rooms);
  router.use(chat);
  router.use(queue);
  router.use(user);

module.exports = router;
