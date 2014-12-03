var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var db = require('./server/database.js');

var server = require('http').Server(app);
var io = require('socket.io')(server);

var routes = require('./server/routes.js')(io);

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/client');

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
};

app.use(allowCrossDomain);

app.use('/', routes);

server.listen(1337);

module.exports = server;
