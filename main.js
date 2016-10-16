var express = require('express');
var router = express.Router();

var http = require('http');

//We don't need to map any special route handling.
//Just mapping the static directory.
router.use(express.static('static'));

module.exports = router;
