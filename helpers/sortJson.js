var sortJsonArray = require('sort-json-array');

exports.sortJson = function(err, data, callback){
    var result = sortJsonArray(data, 'Nom');
    callback(err, result);
}