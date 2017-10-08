var db = require('../db/db.js');

exports.find = function(err, query, callback){
  db.find(err, query, function(err, result){
      callback(err, result);
  });
}