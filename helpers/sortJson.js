var sortJsonArray = require('sort-json-array');

/* Sorts JSON array
* Params
*   err: Error object
*   data: A JSON array
*   callback: Returns error ibject and sorted array
*/
exports.sortJson = function(err, data, property, callback) {
  try{
    var result = sortJsonArray(data, property);
    callback(err, result);
  } catch(err) {
    console.log(err);
    callback(err);
  }
}