var db = require('../db/db.js');
var jsonToXml = require('../helpers/format-helpers.js').jsonToXml;
var jsonToCsv = require('../helpers/format-helpers.js').jsonToCsv;


exports.find = function(err, options, callback) {
  db.find(err, options.params, options.fields, function(err, data){
    if(err){
      console.log("Erreur: "+ err); 
    }

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
      callback("501");
    }
  });
}