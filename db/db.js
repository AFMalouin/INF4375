var config = require('../config.js')
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var _ = require('underscore');
var sortJson = require('../helpers/sortJson.js').sortJson;
var trimEntries = require('../helpers/sanitize-entries.js').trim;

var _db;

getDb = function() {
  return _db;
}

exports.connectToServer = function(callback) {
  // https://stackoverflow.com/a/24634454
  //MongoClient.connect( config.db.heroku, function( err, db ) {
  MongoClient.connect( config.db.local, function( err, db ) {
    if (err) {
      err.status = 500;
      console.log(err);
    }
    _db = db;
    return callback(err);
  });
}

exports.save = function(err, data, callback) {
  var db = getDb();

  if (data.length <= 0){
    callback(err);
  }
  db.collection(config.db.maincollection, function (err, collection) {
    if (err) {
      err.status = 500;
      console.log(err);
      db.close();
      callback(err);
    } else {
      trimEntries(err, data, function(err, data){
        collection.insert(data, function (err, result) {
          if (err) {
            err.status = 500;
            console.log(err);
          } else {
            console.log(data.length + " " + data[0].Type +"(s) ajouté(s)");
          }
          callback(err);
        });
      });
    }
  });
}

exports.find = function(err, query, fields, callback) {
  var db = getDb();

  db.collection(config.db.maincollection, function (err, collection) {
    if (err) {
      db.close();
      err.status = 500;
      console.log(err);
      callback(err);
    } else {
      if (typeof(query._id) !== 'undefined'){
        var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
        if (checkForHexRegExp.test(query._id)){
          query._id = ObjectID(query._id);
        } else {
          var err = new Error('Format de ID invalide');
          err.status = 400;
          console.log(err);
          callback(err);
        }
      }
      collection.find(query, fields, function (err, result) {
        if (err) {
          db.close();
          err.status = 500;
          console.log(err);
          callback(err);
        } else {
          var results = result.toArray();
          results
            .then(function (res) {
              stringnifyIds(err, res, function(err, data){
                sortJson(err, res, function(err, data){
                  callback(err, data);
                });
              });
          }).catch(function (err) {
            err.status = 500;
            console.log(err);
            callback(err);
          });
        }
      });
    }
  });
}

exports.removeAllInstallations = function(err, callback){
  var db = getDb();
  db.collection(config.db.maincollection, function (err, collection) {
    collection.remove();
    if (err){
      err.status = 500;
      console.log(err);
    }
    callback(err);
  });
}

var stringnifyIds = function(err, data, callback) {
  for (var i = 0; i < data.length; i++) {
    if (_.has(data[i], config.fields.id)){
      data[i]._id =  data[i]._id.toString();
    }
  }
  callback(err, data);
}