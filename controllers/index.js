var express = require('express');
var router = express.Router();
var installation = require('../models/installation.js');

router.get('/', function(req, res, next) {
  installation.find(null, {}, {"_id": "true", "name": "true", "condition": "false", "borough": "false"}, function(err, installationNames){

    console.log(JSON.stringify(installationNames));
    res.render('layout', {title: "Mon appu", installationNames: installationNames});
  });
});

module.exports = router;
