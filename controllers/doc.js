var express = require('express');
var raml2html = require('raml2html');
var router = express.Router();

router.get('/', function(req, res, next) {
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

module.exports = router;
