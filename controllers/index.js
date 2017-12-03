var config = require('../config.js');
var express = require('express');
var raml2html = require('raml2html');
var jsonschema = require('jsonschema');
var installation = require('../models/installation.js');
var changeInstallationSchema = require('./schemas/change-single-installation.json');
var router = express.Router();

router.get('/', function(req, res, next) {

  // Options for the db query to populate dropdown
  var options = {
    params: {},
    format: "json",
    fields: { "_id": "true",
             "nom": "true",
             "description": "false",
             "condition": "false",
             "arrondissement": "false",
             "addresse": "false"}
  };
  
  // Find all installation names and their id
  installation.find(null, options, function(err, data) {
    if (err) {
      if (!err.status) {
        err.status = 500;
      }
      res.status(err.status);
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
  }, function(err) {
    // Error
    console.log(err);
    if (!err.status) {
      err.status = 500;
    }
    res.status(err.status);
    res.render('error', {error: err});
  });
});

router.get('/installations', function(req, res, next) {
  var params = {};

  if (req.query.arrondissement) {
    params.Arrondissement = req.query.arrondissement;
  }

  var options = {
    params: params,
    format: "json",
    fields: []
  };

  installation.find(null, options, function(err, data) {
    if (err) {
      if (!err.status) {
        err.status = 500;
      }
      res.status(err.status);
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

  installation.find(null, options, function(err, data) {
    if(err) {
      if (!err.status) {
        err.status = 500;
      }
      res.status(err.status);
      res.render('error', {error: err});
    } else {
      if (data.length === 0) {
        // No installation found
        err = new Error('Aucun document trouvé avec l\'id: ' +  req.params.id);
        err.status = 404;
        res.status(err.status);
        res.render('error', {error: err});
      } else {
        res.setHeader('Content-Type', 'application/json');
        // Remove single installation from array 
        res.send(JSON.stringify(data[0]));
      }
    }
  });
});

router.put('/installations/:id', function(req, res, next) {
  var id =  req.params.id;
  var data = req.body;

  var result = jsonschema.validate(data, changeInstallationSchema);

  if (result.errors.length !== 0) {
    err = new Error('Requête mal formée.');
    err.status = 400;
    res.status(err.status);
    res.render('error', {error: err});
  } else {
    installation.updateSlide(null, id, data, function(err, object){
      if (err){
        if (!err.status) {
          err.status = 500;
        }
        res.status(err.status);
        res.render('error', {error: err});
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        res.send(JSON.stringify(object.value));
      }
    });
  }
});

router.delete('/installations/:id', function(req, res, next) {
  var id =  req.params.id;

  installation.deleteSlide(null, id, function(err, object){
    if (err){
      if (!err.status) {
        err.status = 500;
      }
      res.status(err.status);
      res.render('error', {error: err});
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(204);
      res.send();
    }
  });
});

router.get('/mauvaisesconditions.json', function(req, res, next) {
  var options = {
    params: {condition : "Mauvaise"},
    format: "json",
    fields: {}
  };

  installation.find(null, options, function(err, data) {
    if(err) {
      if (!err.status) {
        err.status = 500;
      }
      res.status(err.status);
      res.render('error', {error: err});
    } else {
      res.set('Content-Type', 'application/json');
      res.send(data);
    }
  });
});

router.get('/mauvaisesconditions.csv', function(req, res, next) {
  var options = {
    params: {condition : "Mauvaise"},
    format: "csv",
    fields: {}
  };

  installation.find(null, options, function(err, data) {
    if(err) {
      if (!err.status) {
        err.status = 500;
      }
      res.status(err.status);
      res.render('error', {error: err});
    } else {
      res.set('Content-Type', 'text/csv');
      res.send(data);
    }
  });
});

router.get('/mauvaisesconditions.xml', function(req, res, next) {
  var options = {
    params: {condition : "Mauvaise"},
    format: "xml",
    fields: {}
  };

  installation.find(null, options, function(err, data) {
    if(err) {
      if (!err.status) {
        err.status = 500;
      }
      res.status(err.status);
      res.render('error', {error: err});
    } else {
      res.set('Content-Type', 'text/xml');
      res.send(data);
    }
  });
});

module.exports = router;
