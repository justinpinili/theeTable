var express = require('express');
var app = express();
var db = require('./server/database.js');
var routes = require('./server/routes.js');

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/client');

app.use(express.static(__dirname));

app.use('/', routes);

app.listen(1337);
