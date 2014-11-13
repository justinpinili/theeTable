var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/rooms/:id', function(req,res) {

});

router.get('/queue/:id', function(req, res) {

});

router.get('/chat/:id', function(req, res) {

});

module.exports = router;
