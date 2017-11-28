var xml2js = require('xml2js');
var csv = require('csvtojson');
var js2xmlparser = require("js2xmlparser");
var json2csv = require('json2csv');
var _ = require('underscore');

exports.xmlToJson = function(err, attributes, data, callback) {
  var parser = new xml2js.Parser({explicitArray : false});
  
  parser.parseString(data, function (err, result) {
    if (err){
      console.log(err);
      callback(err);
    } else {
      var jsonEntries = result[attributes[0]][attributes[1]];
      callback(err, jsonEntries);
    }
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
    if (err){
      console.log(err);
      callback(err);
    } else {
      callback(err, jsonEntries);
    }
  });  
}

exports.jsonToXml = function(err, data, callback) {
    var options = {
      declaration: {
          include: true,
          encoding: "UTF-8"
      }
    };
    var xmlEntries = js2xmlparser.parse("installation", data, options);
    callback(err, xmlEntries);
  }

exports.jsonToCsv = function(err, data, callback) {
  fields = _.keys(data[0]);
  var csvEntries = json2csv({data: data, fields: fields});
  callback(err, csvEntries);
}