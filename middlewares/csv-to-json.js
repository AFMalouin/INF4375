var csv = require('csvtojson');

function convertCsvData(err, data, callback) {
  var parsedEntries = [];
  csv()
  .fromString(data)
  .on('json', (jsonobj) => {
    parsedEntries.push(jsonobj);
  })
  .on('done', (err) => {
    
    callback(err, parsedEntries);
  });  
}

exports.convertCsvData = convertCsvData;