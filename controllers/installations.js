var express = require('express');
var router = express.Router();
var installation = require('../models/installation.js');

router.get('/', function(req, res, next) {
  query = {borough : req.query.arrondissement};
  installation.find(null, query, function(err, result){
    res.send(result);
  });
});

module.exports = router;
