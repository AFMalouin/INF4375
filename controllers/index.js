var express = require('express');
var router = express.Router();
var installation = require('../models/installation.js');
var sort = require('../helpers/sortJson.js').sortJson;

router.get('/', function(req, res, next) {
  installation.find(null, {}, {"_id": "true", "name": "true", "condition": "false", "borough": "false"}, function(err, installationNames){
    sort(err, installationNames, function(err, installationNames){
      console.log(JSON.stringify(installationNames));
      res.render('layout', {title: "Mon app", installationNames: installationNames});
    })
  });
});

module.exports = router;
