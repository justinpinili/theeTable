var express = require('express');
var create = require('./schema.js');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/rooms/:id', function(req, res) {
  // Go into an existing room
});

router.post('/rooms/:id', function(req, res) {
  // Create a new room
});

router.post('/queue/:id', function(req, res) {
  // Add song to the queue
});

router.post('/chat/:id', function(req, res) {
  // Add message to the messages
});

router.post('/addUser', function(req, res) {
  // Create a user
});

router.post('/login', function(req, res) {
  // Log in a user
});

module.exports = router;
