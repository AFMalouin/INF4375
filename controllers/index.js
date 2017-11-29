var config = require('../config.js');
var express = require('express');
var raml2html = require('raml2html');
var installation = require('../models/installation.js');
var router = express.Router();

router.get('/', function(req, res, next) {

  // Options for the db query to populate dropdown
  var options = {
    params: {},
    format: "json",
    fields: { "_id": "true",
             "Nom": "true",
             "Condition": "false",
             "Arrondissement": "false",
             "Addresse": "false"}
  };
  
  // Find all instalaltion names and their id
  installation.find(null, options, function(err, data){
    if (err){
      res.status(500);
      res.render('error', {error: err});
    } else {
      res.render('layout', {title: config.appTitle, installationNames: data});
    }
  });
});

router.get('/doc', function(req, res, next) {
  const config = raml2html.getConfigForTheme();
  raml2html.render("controllers/doc/index.raml", config).then(function(html) {
    // Success
    res.send(html);
  }, function(err){
    // Error
    console.log(err);
    res.status(500);
    res.render('error', {error: err});
  });
});

router.get('/installations', function(req, res, next) {
  var params = {};

  if (req.query.arrondissement){
    params.Arrondissement = req.query.arrondissement;
  }

  var options = {
    params: params,
    format: "json",
    fields: []
  };

  installation.find(null, options, function(err, data){
    if (err){
      res.status(err.status || 500);
      res.render('error', {error: err});
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    }
  });
});

router.get('/installations/:id', function(req, res, next) {
  var options = {
    params: {_id: req.params.id},
    format: "json",
    fields: []
  };

  installation.find(null, options, function(err, data){
    if(err){
      res.status(err.status || 500);
      res.render('error', {error: err});
    } else {
      if (data.length === 0){
        // No installation found
        err = new Error('Aucun document trouvé avec l\'id: ' +  req.params.id);
        err.status = 404;
        res.status(err.status);
        res.render('error', {error: err});
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data));
      }
    }
  });
});

router.get('/mauvaisesconditions.json', function(req, res, next) {
  var options = {
    params: {Condition : "Mauvaise"},
    format: "json",
    fields: {}
  };

  installation.find(null, options, function(err, data){
    if(err){
      res.status(err.status || 500);
      res.render('error', {error: err});
    } else {
      res.set('Content-Type', 'application/json');
      res.send(data);
    }
  });
});

router.get('/mauvaisesconditions.csv', function(req, res, next) {
  var options = {
    params: {Condition : "Mauvaise"},
    format: "csv",
    fields: {}
  };

  installation.find(null, options, function(err, data){
    if(err){
      res.status(err.status || 500);
      res.render('error', {error: err});
    } else {
      res.set('Content-Type', 'text/csv');
      res.send(data);
    }
  });
});

router.get('/mauvaisesconditions.xml', function(req, res, next) {
  var options = {
    params: {Condition : "Mauvaise"},
    format: "xml",
    fields: {}
  };

  installation.find(null, options, function(err, data){
    if(err){
      res.status(err.status || 500);
      res.render('error', {error: err});
    } else {
      res.set('Content-Type', 'text/xml');
      res.send(data);
    }
  });
});

module.exports = router;
