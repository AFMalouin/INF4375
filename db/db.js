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
  //MongoClient.connect( "mongodb://heroku_wdk79gdg:avd3h0ujeb8bbrjjk4nbectibo@ds231715.mlab.com:31715/heroku_wdk79gdg", function( err, db ) {
  MongoClient.connect( "mongodb://localhost:27017/tp1", function( err, db ) { // TODO put switch in config
    _db = db;
    return callback(err);
  });
}

exports.save = function(err, data, callback) {
  var db = getDb();

  if (data.length <= 0){
    callback(err);
  }
  db.collection("installations", function (err, collection) {
    if (err) {
      console.log("Erreur avec la base de données.", err);
      db.close();
    } else {
      trimEntries(err, data, function(err, data){
        collection.insert(data, function (err, result) {
          if (err) {
            console.log("Erreur lors de l'insertion de " + data, err);
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

  db.collection("installations", function (err, collection) {
    if (err) {
      console.log("Erreur avec la base de données.", err);
      db.close();
    } else {
      if (typeof(query._id) !== 'undefined'){
        var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
        if (checkForHexRegExp.test(query._id)){
          query._id = ObjectID(query._id);
        } else {
          callback("Format de id invalide");
        }
      }
      collection.find(query, fields, function (err, result) {
        if (err) {
          db.close();
          console.log("Erreur lors de la recherche.", err);
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
            callback(err);
          });
        }
      });
    }
  });
}

exports.removeAllInstallations = function(err, callback){
  var db = getDb();
  db.collection("installations", function (err, collection) {
    collection.remove();
  });
  callback(err);
}

var stringnifyIds = function(err, data, callback) {
  for (var i = 0; i < data.length; i++) {
    if (_.has(data[i], '_id')){
      data[i]._id =  data[i]._id.toString();
    }
  }
  callback(err, data);
}