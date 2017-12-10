/*
 * Copyright 2013 Jacques Berger.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var config = require('../config.js');
var http = require('http');
var _ = require('lodash');
var csvToJson = require('../helpers/format-helpers.js').csvToJson;
var trimEntries = require('../helpers/sanitize-entries.js').trim;
var db = require('../db/db.js');
var logger = require('../helpers/logger.js');

/* Fetch all pools via HTTP request according to
*  options set in config
* Params
*   err: The error object
*   callback: Returns error object and a JSON
*             array of pools
*/
exports.fetchData = function(err, callback) {
  var options = config.getPoolsOptions;

  var request = http.get(options, function (result) {
    if (result.statusCode !== 200) {
      err = new Error('HTTP Error: ' + result.statusCode);
      logger.log(err, result.statusCode);
      callback(err);
    } else {
      var chunks = [];
      result.setEncoding('utf-8');
      
      result.on('data', function (chunk) {
        chunks.push(chunk);
      });

      result.on('end', function () {
        var data = chunks.join('');
        csvToJson(err, data, function(err, parsedEntries) {
          normalize(err, parsedEntries, function(err, normalizedDocuments) {
            if (err) {
              logger.log(err, 500);
              callback(err);
            } else {
              if (normalizedDocuments.length > 0) {
                db.save(err, normalizedDocuments, function(err) {
                  callback(err);
                });
              } else {
                callback(null);
              }
            }
          });
        });
      });
    }
  });
  
  request.on('error', function (err) {
    logger.log(err, 500);
    callback(err);
  });
  
  request.end();
}

/* Turns pools into installations consistant across the installations DB
* Params
*   err: Error object
*   data: Array of raw json documents to normalize
*   callback: Returns error object and array of normalized documents
*/
var normalize = function(err, data, callback) {
  if (err) {
    logger.log(err, 500);
    callback(err);
  } else {
    try{
      var normalizedDocuments = [];
      var remainingDocuments = data.length;
    
      _.each(data, function(element, index, list) {
        var normalizedDocument = {
          type : config.types.pool,
          nom : element.NOM,
          description : element.TYPE,
          arrondissement : element.ARRONDISSE,
          addresse : element.ADRESSE,
          condition : 'N/A'
        };
    
        normalizedDocuments.push(normalizedDocument);
        remainingDocuments -= 1;
    
        if (remainingDocuments == 0) {
          trimEntries(err, normalizedDocuments, function(err, data) {
            if (err) {
              logger.log(err, 500);
              callback(err);
            } else {
              callback(err, data);
            } 
          });
        }
      });
    } catch(err) {
      logger.log(err, 500);
      callback(err);
    }
  }
}