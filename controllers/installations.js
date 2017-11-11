var express = require('express');
var router = express.Router();
var installation = require('../models/installation.js');

router.get('/', function(req, res, next) {
  var params = {};

  if (req.query.arrondissement){
    params.borough = req.query.arrondissement;
  }

  if (req.query.condition){
    params.condition = req.query.condition;
  }

  installation.find(null, params, {}, function(err, data){
    if(req.query.ajax === 'true') {
      res.render('search-results', {results: data});
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    }
  });
});

router.get('/:id', function(req, res, next) {
  var params = {};

  if (req.params.id){
    params._id = req.params.id;
  }

  installation.find(null, params, {}, function(err, data){
    if(req.query.ajax === 'true') {
      res.render('search-results', {results: data});
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    }
  });
});

module.exports = router;
