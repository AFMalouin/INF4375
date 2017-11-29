// Models
var pool = require('../models/pool.js')
var rink = require('../models/rink.js')
var slide = require('../models/slide.js')

// purge the DB and fetch the data for the 3 installation types
exports.fetchData = function(err, db){
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