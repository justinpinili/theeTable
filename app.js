var express = require('express');
var app = express();
var db = require('./server/database.js');

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/client');

app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(1337);
