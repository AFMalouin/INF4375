var db = require('../db/db.js');
var jsonToXml = require('../helpers/format-helpers.js').jsonToXml;
var jsonToCsv = require('../helpers/format-helpers.js').jsonToCsv;


exports.find = function(err, options, callback) {
  db.find(err, options.params, options.fields, function(err, data){
    if(err){
      callback(err);
    } else {
      if (options.format === "xml") {
        jsonToXml(err, data, function(err, result){
          callback(err, result);
        });
      } else if (options.format === "csv") {
        jsonToCsv(err, data, function(err, result){
          callback(err, result);
        });
      } else if (options.format === "json") {
        callback(err, data);
      } else {
        err = new Error('Format de fichier non reconnu: ' + options.format);
        err.status = 400;
        console.log(err);
        callback(err);
      }
    }
  });
}