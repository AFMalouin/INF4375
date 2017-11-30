var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var scheduler = require('node-schedule');

// Local dependencies
var config = require('./config.js')
var db = require('./db/db.js');
var fetchData = require('./helpers/fetch-data.js').fetchData;

// Controller
var index = require('./controllers/index.js');

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

  // initial fetching of the data on app start
  fetchData(null);

  // set cron everyday at midnight
  var rule = new scheduler.RecurrenceRule();
  rule.hour = config.cron.hour;
  rule.minute = config.cron.minute;

  scheduler.scheduleJob(rule, function() {
    fetchData(null);
  });
});

module.exports = app;