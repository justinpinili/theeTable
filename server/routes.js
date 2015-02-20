var express = require('express');

var router = express.Router();

var rooms = require('./routes/rooms.js');
var user  = require('./routes/user.js');

// Front End
router.get('/', function(req, res) {
  res.render('index', { soundcloudClientID: '3fad6addc9d20754f8457461d02465f2' });
});

router.get('/success', function(req, res) {
  res.render('success');
});

// API Endpoints
router.use(rooms);
router.use(user);

module.exports = router;
