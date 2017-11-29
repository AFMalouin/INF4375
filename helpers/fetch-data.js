var db = require('../db/db.js');

// Models
var pool = require('../models/pool.js')
var rink = require('../models/rink.js')
var slide = require('../models/slide.js')

/* Purge the DB and fetch the data for the 3 installation types
* Params
*   err: The error object
*/
exports.fetchData = function(err){
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