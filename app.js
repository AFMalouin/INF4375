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
var users = require('./controllers/users.js');
var doc = require('./controllers/doc.js');
var installations = require('./controllers/installations.js');
var badCondition = require('./controllers/badCondition.js');

// Models
var pool = require('./models/pool.js')
var rink = require('./models/rink.js')
var slide = require('./models/slide.js')

var app = express();

db.connectToServer(function(err) {

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', index);
  app.use('/users', users);
  app.use('/doc', doc);
  app.use('/installations', installations);
  app.use('/badCondition', badCondition);

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

  // Set crons

  pool.fetchData(null, function(err){
    if (err) {
      console.log('Erreur dans le fetch de pool: ' + err);
    }
  });
  rink.fetchData(null, function(err){
    if (err) {
      console.log('Erreur dans le fetch de rink: ' + err);
    }
  });
  slide.fetchData(null, function(err){
    if (err) {
      console.log('Erreur dans le fetch de slide: ' + err);
    }
  });

  var rule = new scheduler.RecurrenceRule();
  rule.hour = 12;
  rule.dayOfWeek = new scheduler.Range(0,6);


  scheduler.scheduleJob(rule, function(){
    pool.fetchData(null, function(err){
      if (err) {
        console.log('Erreur dans le cron de pool: ' + err);
      }
    });
    rink.fetchData(null, function(err){
      if (err) {
        console.log('Erreur dans le cron de rink: ' + err);
      }
    });
    slide.fetchData(null, function(err){
      if (err) {
        console.log('Erreur dans le cron de slide: ' + err);
      }
    });
  });
});

module.exports = app;