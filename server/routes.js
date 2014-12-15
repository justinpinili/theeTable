var express = require('express');

var router = express.Router();

var rooms = require('./routes/rooms.js');
var user  = require('./routes/user.js');

// Front End
router.get('/', function(req, res) {
  res.render('index');
});

// API Endpoints
router.use(rooms);
router.use(user);

module.exports = router;
