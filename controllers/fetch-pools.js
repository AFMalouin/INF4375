var express = require('express');
var router = express.Router();
var pool = require('../models/pool.js')

router.post('/', function(req, res, next) {
  pool.getData(null, next);
  res.send('respond with a resource');
});

module.exports = router;
