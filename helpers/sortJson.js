var sortJsonArray = require('sort-json-array');

exports.sortJson = function(err, data, callback){
    var result = sortJsonArray(data, 'name');
    callback(err, result);
}