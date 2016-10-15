var express = require('express');
var router = require('./main');

var app = express();

app.use('/', router);

// var mongo = require('./mongostore');

// mongo.init(function(res) {

var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

// });
