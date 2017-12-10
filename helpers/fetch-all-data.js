var db = require('../db/db.js');
var logger = require('./logger.js');

// Models
var pool = require('../models/pool.js')
var rink = require('../models/rink.js')
var slide = require('../models/slide.js')

/* Purge the DB and fetch the data for the 3 installation types.
* Params
*   err: The error object
*   callback: Returns the error object
*/
exports.fetchAllData = function(err, callback) {
  var fetchAttempted = {
    pool: false,
    rink: false,
    slide: false
  }

  db.removeAllInstallations(err, function(err) {
    pool.fetchData(err, function(err) {
      if (err) {
        logger.log('Erreur dans le fetch de pool');
      }

      fetchAttempted.pool = true;
      checkExitCondition(err, fetchAttempted, callback);
    });
    rink.fetchData(err, function(err) {
      if (err) {
        logger.log('Erreur dans le fetch de rink');
      }

      fetchAttempted.rink = true;
      checkExitCondition(err, fetchAttempted, callback);
    });
    slide.fetchData(err, function(err) {
      if (err) {
        logger.log('Erreur dans le fetch de slide');
      }

      fetchAttempted.slide = true;
      checkExitCondition(err, fetchAttempted, callback);
    });
  });
}

// When all 3 installation types have 
// been fetched, we can return
var checkExitCondition = function(err, fetchAttempted, callback) {
  if (fetchAttempted.pool === true &&
      fetchAttempted.rink === true &&
      fetchAttempted.slide === true) {
    callback(err)
  }
}