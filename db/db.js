var config = require('../config.js');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var _ = require('underscore');
var sortJson = require('../helpers/sortJson.js').sortJson;

var _db;

getDb = function() {
  return _db;
}

exports.connectToServer = function(callback) {
  // https://stackoverflow.com/a/24634454
  //MongoClient.connect( config.db.heroku, function( err, db ) {
  MongoClient.connect( config.db.local.address, function( err, db ) {
    if (err) {
      err.status = 500;
      console.log(err);
    }
    _db = db;
    return callback(err);
  });
}

/* Insert installations in the DB
* Params
*   err: The error object
*   data: An array of installations to save
*   callback: Returns error object
*/
exports.save = function(err, data, callback) {
  var db = getDb();

  if (data.length <= 0) {
    // No data to be inserted
    callback(err);
  }

  db.collection(config.db.mainCollection, function (err, collection) {
    if (err) {
      err.status = 500;
      console.log(err);
      db.close();
      callback(err);
    } else {
      collection.insert(data, function (err, result) {
        if (err) {
          err.status = 500;
          console.log(err);
        } else {
          console.log(data.length + ' ' + data[0].type +'(s) ajouté(s)');
        }
        callback(err);
      });
    }
  });
}

/* Find installations in the DB
* Params
*   err: The error object
*   query: A mongoDb search query
*   fields: The installation fields to be returned 
*   callback: Returns error object and an array of installations
*/
exports.find = function(err, query, fields, callback) {
  var db = getDb();

  db.collection(config.db.mainCollection, function (err, collection) {
    if (err) {
      db.close();
      console.log(err);
      callback(err);
    } else {
      createObjectId(err, query, function(err, query) {
        if (err) {
          callback(err);
        } else {
          collection.find(query, fields, function (err, result) {
            if (err) {
              db.close();
              console.log(err);
              callback(err);
            } else {
              var results = result.toArray();
              results
                .then(function (res) {
                  // Success
                  stringnifyIds(err, res, function(err, data) {
                    if (err) {
                      callback(err);
                    } else {
                      sortJson(err, res, config.fields.name, function(err, data) {
                        if (err){
                          callback(err);
                        } else {
                          callback(err, data);
                        }
                      });
                    }
                  });
                }).catch(function (err) {
                // Error
                console.log(err);
                callback(err);
              });
            }
          });
        }
      });
    }
  });
}

/* Delete a single installation in the DB
* Params
*   err: The error object
*   id: The string id of the slide to delete
*   type: The type of the installation to delete
*   callback: Returns the error object
*/
exports.deleteInstallation = function(err, id, type, callback) {
  var db = getDb();

  db.collection(config.db.mainCollection, function (err, collection) {
    if (err) {
      db.close();
      console.log(err);
      callback(err);
    } else {
      var query = {_id: id, type: type};
  
      createObjectId(err, query, function(err, query){
        if (err){
          callback(err);
        } else {
          collection.deleteOne(query, function (err, object){
            if (err) {
              console.log(err);
              callback(err);
            } else {
              if (object.deletedCount === 0) {
                var err = new Error('Aucune glissade trouvée avec l\'id: ' + id);
                err.status = 404;
                console.log(err);
                callback(err);
              } else {
                callback(err, object);
              }
            }
          });
        }
      });
    }
  });
}

/* Update the state of a single slide in the db
* Params
*   err: The error object
*   id: The string id of the slide to update
*   type: The type of the installation to update
*   modifications: The field(s) to modify and the 
*                  new value(s)
*   callback: Returns error object and the updated object
*/
exports.updateInstallation = function(err, id, type, modifications, callback) {
  var db = getDb();
  db.collection(config.db.mainCollection, function (err, collection) {
    if (err) {
      db.close();
      console.log(err);
      callback(err);
    } else {
      var query = {_id: id, type: type};
      var replacement = {$set: modifications};
      var options = {returnOriginal: false}; // Return the modified record
  
      createObjectId(err, query, function(err, query){
        if (err){
          callback(err);
        } else {
          console.log('query = '+ JSON.stringify(query));
          collection.findOneAndUpdate(query, replacement, options, function (err, object){
            if (err) {
              console.log(err);
              callback(err);
            } else {
              if (object.value === null) {
                var err = new Error('Aucune glissade trouvée avec l\'id: ' + id);
                err.status = 404;
                console.log(err);
                callback(err);
              } else {
                callback(err, object);
              }
            }
          });
        }
      });
    }
  });
}

/* Purge the DB of any installation
* Params
*   err: The error object
*   callback: Returns error object
*/
exports.removeAllInstallations = function(err, callback) {
  var db = getDb();
  db.collection(config.db.mainCollection, function (err, collection) {
    collection.remove();
    if (err) {
      console.log(err);
    }
    callback(err);
  });
}

/* Turns mongoDB ObjectIds into strings
* Params
*   err: The error object
*   data: An array of ObjectIds
*   callback: Returns error object and array of strignified ids
*/
var stringnifyIds = function(err, data, callback) {
  try{
    for (var i = 0; i < data.length; i++) {
      if (_.has(data[i], config.fields.id)) {
        data[i]._id =  data[i]._id.toString();
      }
    }
    callback(err, data);
  } catch(err) {
    console.log(err);
    callback(err);
  }
}

/* Validate that an id can be turned into a MongoDB ObjectId and
   returns the mongoDB query with it's id turned into an ObjectId
* Params
*   err: The error object
*   query: A mongoDB query
*   callback: Returns the error object and the mongoDB query 
*             with the id turned into an ObjectId
*/
var createObjectId = function(err, query, callback) {
  if (typeof(query._id) !== 'undefined') {
    // Query contains an id to validate
    var checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

    if (checkForHexRegExp.test(query._id)) {
      // Id is in a valid format
      query._id = ObjectID(query._id);
      callback(err, query);
    } else {
      // Id is in an invalid format
      var err = new Error('Format de ID invalide');
      err.status = 400;
      console.log(err);
      callback(err);
    }
  } else {
    // Query does not contain an id, nothing to do here
    callback(err, query)
  }
}