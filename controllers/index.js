var config = require('../config.js');
var express = require('express');
var raml2html = require('raml2html');
var installation = require('../models/installation.js');
var router = express.Router();

router.get('/', function(req, res, next) {
  var options = {
    params: {},
    format: "json",
    fields: { "_id": "true",
             "Nom": "true",
             "Condition": "false",
             "Arrondissement": "false",
             "Addresse": "false"}
  };
  installation.find(null, options, function(err, data){
    res.render('layout', {title: config.appTitle, installationNames: data});
  });

});

router.get('/doc', function(req, res, next) {
  const config = raml2html.getConfigForTheme();
  raml2html.render("controllers/doc/index.raml", config).then(function(html) {
    // Succes
    res.send(html);
  }, function(err){
    // Erreur
    console.log(err);
    res.sendStatus(500);
  });
});

router.get('/installations', function(req, res, next) {
  var params = {};
  var fields = [];

  if (req.query.arrondissement){
    params.Arrondissement = req.query.arrondissement;
  }

  if (req.query.condition){
    params.Condition = req.query.condition;
  }

  var options = {
    params: params,
    format: "json",
    fields: []
  };

  installation.find(null, options, function(err, data){
    if (err){
      res.status(err.status).send({error: ''});
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
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
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
      console.log("Erreur: "+ err);
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
      console.log("Erreur: "+ err);
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
      console.log("Erreur: "+ err);
    } else {
      res.set('Content-Type', 'text/xml');
      res.send(data);
    }
  });
});

module.exports = router;
