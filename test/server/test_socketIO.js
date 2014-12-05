var should          = require('should');
var request         = require('supertest');

var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:5000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};
