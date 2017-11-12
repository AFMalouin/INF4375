var express = require('express');
var router = express.Router();
var installation = require('../models/installation.js');
var sortJson = require('../helpers/sortJson.js').sortJson;
var jsonToXml = require('../helpers/format-helpers.js').jsonToXml;
var jsonToCsv = require('../helpers/format-helpers.js').jsonToCsv;


// HTTP
router.get('/mauvaisesconditions', function(req, res, next) {
  findAndSort(null, function(err, data){
    res.render('search-results', {results: data});
  });
});

router.get('/mauvaisesconditions.json', function(req, res, next) {
  findAndSort(null, function(err, data){
    res.set('Content-Type', 'application/json');
    res.send(data);
  });
});

router.get('/mauvaisesconditions.csv', function(req, res, next) {
  findAndSort(null, function(err, data){
    var fields = ['type', 'name', 'condition', 'borough'];
    jsonToCsv(err, fields, data, function(err, result){
      res.set('Content-Type', 'text/csv');
      res.send(result);
    });
  });
});

router.get('/mauvaisesconditions.xml', function(req, res, next) {
  findAndSort(null, function(err, data){
    jsonToXml(err, data, function(err, result){
      res.set('Content-Type', 'text/xml');
      res.send(result);
    });
  });
});

var findAndSort = function(err, callback){
  query = {condition : "Mauvaise"};
  fields = [];
  installation.find(null, query, fields, function(err, result){
    if (err){
      console.log("Erreur dans la recherche:" + err);
    }
    sortJson(err, result, function(err, data){
      callback(err, data);
    });
  });
}

module.exports = router;
