var sortJsonArray = require('sort-json-array');
var logger = require('../helpers/logger.js');

/* Sorts JSON array
* Params
*   err: Error object
*   data: A JSON array
*   callback: Returns error object and sorted array
*/
exports.sortJson = function(err, data, property, callback) {
  if (err) {
    logger.log(err, 500);
    callback(err);
  } else {
    try{
      var result = sortJsonArray(data, property);
      callback(err, result);
    } catch(err) {
      logger.log(err, 500);
      callback(err);
    }
  }
}