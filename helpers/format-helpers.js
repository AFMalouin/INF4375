var xml2js = require('xml2js');
var csv = require('csvtojson');
var js2xmlparser = require("js2xmlparser");
var json2csv = require('json2csv');

exports.xmlToJson = function(err, attributes, data, callback) {
  var parser = new xml2js.Parser({explicitArray : false});
  
  parser.parseString(data, function (err, result) {
    var jsonEntries = result[attributes[0]][attributes[1]];
    callback(err, jsonEntries);
  });
}

exports.csvToJson = function(err, data, callback) {
  var jsonEntries = [];
  csv()
  .fromString(data)
  .on('json', (jsonobj) => {
    jsonEntries.push(jsonobj);
  })
  .on('done', (err) => {
    
    callback(err, jsonEntries);
  });  
}

exports.jsonToXml = function(err, data, callback) {
    var options = {
      declaration: {
          include: true,
          encoding: "UTF-8"
      }
    };
  
    //Weird hack
    var data = (JSON.stringify(data));
    var data = JSON.parse(data);
  
    var xmlEntries = js2xmlparser.parse("installation", data, options);
    callback(err, xmlEntries);
  }

exports.jsonToCsv = function(err, fields, data, callback) {
  var csvEntries = json2csv({data: data, fields: fields});
  callback(err, csvEntries);
}