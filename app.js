var config = require('./config.js')
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var scheduler = require('node-schedule');

var db = require('./db/db.js');

// Controllers
var index = require('./controllers/index.js');

// Models
var pool = require('./models/pool.js')
var rink = require('./models/rink.js')
var slide = require('./models/slide.js')

var app = express();

db.connectToServer(function(err) {

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.use(favicon(path.join(__dirname, 'public', config.favicon)));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', index);
  
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  fetchData(null, db);

  // Set cron
  var rule = new scheduler.RecurrenceRule();
  rule.hour = config.cron.hour;

  scheduler.scheduleJob(rule, function(){
    fetchData(null, db);
  });
});

var fetchData = function(err, db){
  db.removeAllInstallations(err, function(err){
    pool.fetchData(err, function(err){
      if (err) {
        console.log('Erreur dans le fetch de pool: ' + err);
      }
    });
    rink.fetchData(err, function(err){
      if (err) {
        console.log('Erreur dans le fetch de rink: ' + err);
      }
    });
    slide.fetchData(err, function(err){
      if (err) {
        console.log('Erreur dans le fetch de slide: ' + err);
      }
    });
  });
}

module.exports = app;