var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var db = require('./server/database.js');

var server = require('http').Server(app);
var io = require('socket.io')(server);

var routes = require('./server/routes.js');
var socketIO = require('./server/routes/socketIO.js')(io);

app.set('view engine', 'ejs');

if (!process.env.PORT) {
  var ttURL = 'http://www.theetable.io';
  app.set('views', __dirname + '/dist');
  app.use(express.static(__dirname + '/dist'));
  var keys = require('./server/exampleSecurityKeys.js');
} else {
  var ttURL = 'http://localhost:1337';
  app.set('views', __dirname + '/client');
  app.use(express.static(__dirname + '/client'));
  var keys = require('./server/securityKeys.js');
}

app.use(bodyParser.json());

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
};

app.use(allowCrossDomain);

app.use(routes);

app.get('/', function(request, response) {
  response.render('index', { scID: keys.scID, ttURL: ttURL });
});

app.get('/success', allowCrossDomain, function(req, res) {
  res.render('success');
});

module.exports = server;
