var xml2js = require('xml2js');
var csv = require('csvtojson');
var js2xmlparser = require("js2xmlparser");
var json2csv = require('json2csv');
var _ = require('underscore');

/* Convert a group of XML data into an array of JSON
* Params
*   err: Error object
*   attributes: Object containing the name of the XML sequence
*               and the name of the elements composing the sequence
*   data: Group of XML data
*   callback: Returns error object and array of JSON data
*/
exports.xmlToJson = function(err, attributes, data, callback) {
  var parser = new xml2js.Parser({explicitArray : false});
  
  parser.parseString(data, function (err, result) {
    if (err){
      console.log(err);
      callback(err);
    } else {
      var jsonEntries = 
        result[attributes.sequenceName][attributes.elementName];
      callback(err, jsonEntries);
    }
  });
}

/* Convert a list of CSV data into an array of JSON
* Params
*   err: Error object
*   data: List of CSV data
*   callback: Returns error object and array of JSON data
*/
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

/* Convert an array of JSON data into group of XML
* Params
*   err: Error object
*   data: JSON array to convert
*   callback: Returns error object and group of XML data
*/
exports.jsonToXml = function(err, data, callback) {
    var options = {
      declaration: {
          include: true,
          encoding: "UTF-8"
      }
    };
    try{
      var xmlEntries = js2xmlparser.parse("installation", data, options);
      callback(err, xmlEntries);
    }
    catch(err){
      callback(err);
    }
  }

/* Convert an array of JSON data into a list of CSV
* Params
*   err: Error object
*   data: JSON array to convert
*   callback: Returns error object and lsit of CSV data
*/
exports.jsonToCsv = function(err, data, callback) {
  try {
    fields = _.keys(data[0]);
    var csvEntries = json2csv({data: data, fields: fields});
    callback(err, csvEntries);
  }
  catch(err){
    callback(err);
  }
}