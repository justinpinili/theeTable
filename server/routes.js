var express = require('express');
var create = require('./schema.js');
var router = express.Router();

// Homepage

router.get('/', function(req, res) {
  res.render('index');
});

// Rooms

router.get('/rooms', function(req, res) {
  // Go to room selection
});

router.post('/rooms', function(req, res) {
  // Create a new room
});

router.get('/rooms/:id', function(req, res) {
  // Go into an existing room
  // otherwise, redirect to the room selection
});


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

router.post('/addUser', function(req, res) {
  // Create a user
});

router.post('/login', function(req, res) {
  // Log in a user
});

module.exports = router;
