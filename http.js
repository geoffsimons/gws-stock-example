/**
  This is a little wrapper to load up main.js as a
  port 80 HTTP server.
*/

var express = require('express');
var router = require('./main');

var app = express();

app.use('/', router);

var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
