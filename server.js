var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var db = require('./server/database.js');

var server = require('http').Server(app);
var io = require('socket.io')(server);

var routes = require('./server/routes.js');
var socketIO = require('./server/routes/socketIO.js')(io);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/dist');
app.use(express.static(__dirname + '/dist'));

var ttURL = 'http://localhost:1337';
var keys = require('./server/securityKeys.js');

if (process.env.PORT) {
  ttURL = 'http://www.theetable.io';
  keys = require('./server/exampleSecurityKeys.js');
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
