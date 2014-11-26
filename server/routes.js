var express = require('express');
var create = require('./schema.js');
var router = express.Router();

var rooms = require('./routes/rooms.js');
var chat  = require('./routes/chat.js');
var queue = require('./routes/queue.js');
var user  = require('./routes/user.js');

// Homepage

router.get('/', function(req, res) {
  res.render('index');
});

router.use(rooms);
router.use(chat);
router.use(queue);
router.use(user);

// Queues

router.post('/queue/:id', function(req, res) {
  // Add song to the queue
  // return full queue back to the client
});

// Chats

router.post('/chat/:id', function(req, res) {
  // Add message to the messages
});

// Users

router.post('/user/new', function(req, res) {
  // Create a user
});

router.post('/user/login', function(req, res) {
  // Log in a user
});

module.exports = router;
