var xml2js = require('xml2js');

function convertXmlData(err, data, attributes, callback) {
  var parser = new xml2js.Parser({explicitArray : false});
  
  parser.parseString(data, function (err, result) {
    var parsedEntries = result[attributes[0]][attributes[1]];
    callback(err, parsedEntries);
  });
}

exports.convertXmlData = convertXmlData;