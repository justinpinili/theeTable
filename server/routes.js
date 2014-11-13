var express = require('express');
var create = require('./schema.js');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/rooms/:id', function(req, res) {

});

router.post('/rooms/:id', function(req, res) {

});

router.post('/queue/:id', function(req, res) {

});

router.post('/chat/:id', function(req, res) {

});

router.post('/addUser', function(req, res) {

});

router.post('/login', function(req, res) {

});

module.exports = router;
