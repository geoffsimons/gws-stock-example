var express = require('express');
var router = express.Router();

var http = require('http');
/*
var cookieParser = require('cookie-parser');
router.use(cookieParser());

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ limit: 10000000, extended: true }));
router.use(bodyParser.json());
*/

router.get('/stocks/:symbol', function(req,res) {
  // var url = 'http://dev.markitondemand.com';
  // url += '/MODApis/Api/v2/Quote/json?symbol=';
  // url += req.params.symbol;
  var symbol = req.params.symbol;

  var options = {
    hostname: 'dev.markitondemand.com',
    path: '/MODApis/Api/v2/Quote/json?symbol=' +symbol,
    method: 'GET'
  };

  console.log("Requesting: " +req.params.symbol);
  console.log(options);
  var request = http.request(options, function(response) {
    console.log(" ... response for ",symbol);
    console.log("status:",response.statusCode);
    response.on('data',function(data) {
console.log("Received:",data.toString());
      res.json(data.toString());
    });
    response.on('end',function() {
      console.log("... Fetch complete");
    });
  });
  request.on('error', function(err) {
    console.log(" ... FAILED: ",err);
    res.json(err);
  });
  request.end();

});

router.use(express.static('static'));

module.exports = router;
