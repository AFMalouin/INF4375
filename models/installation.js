var db = require('../db/db.js');

exports.find = function(err, query, fields, callback) {
  db.find(err, query, fields, function(err, result){
    callback(err, result);
  });
}