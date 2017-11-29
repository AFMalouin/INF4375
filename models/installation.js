var db = require('../db/db.js');
var jsonToXml = require('../helpers/format-helpers.js').jsonToXml;
var jsonToCsv = require('../helpers/format-helpers.js').jsonToCsv;


/* Finds and converts installations according to options
* Params
*   err: The error object
*   options: An object containing the DB query parameters, 
*            the DB fields to return and the format to return
*   callback: Returns error object and/or data 
*/
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
        // We return a status 500 since a bad format in the 
        // URL wouldn't be routed and result in a 404
        err = new Error('Format de fichier non reconnu: ' + options.format);
        err.status = 500;
        console.log(err);
        callback(err);
      }
    }
  });
}