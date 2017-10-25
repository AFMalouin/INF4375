var express = require('express');
var router = express.Router();
var installation = require('../models/installation.js');
var sort = require('../helpers/sortJson.js').sortJson;
var jsonToXml = require('../helpers/format-helpers.js').jsonToXml;
var jsonToCsv = require('../helpers/format-helpers.js').jsonToCsv;

router.get('/', function(req, res, next) {
  query = {condition : "Mauvaise"};
  installation.find(null, query, function(err, result){
    if (err){
      console.log("Erreur dans la recherche:" + err);
    }
    sort(err, result, function(err, data){
      if (req.query.format === 'xml') {
        jsonToXml(err, data, function(err, result){
          res.set('Content-Type', 'text/xml');
          res.send(result);
        });
      } else if (req.query.format === 'csv'){
        var fields = ['type', 'name', 'condition', 'borough'];
        jsonToCsv(err, fields, data, function(err, result){
          res.set('Content-Type', 'text/csv');
          res.send(result);
        });
      } else {
        res.send(result);
      }
    });
  });
});

module.exports = router;
