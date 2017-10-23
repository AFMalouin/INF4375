var express = require('express');
var router = express.Router();

var routes = {routes: [{name :'index', url :'/'},
                       {name :'users', url :'/users'},
                       {name :'doc', url :'/doc'},
                       {name :'installations', url :'/installations?arrondissement="arrondissement"'}]};


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('doc', routes);
});

module.exports = router;
