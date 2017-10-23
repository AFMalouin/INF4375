var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var _db;

getDb = function() {
  return _db;
}

exports.connectToServer = function( callback ) {
  // https://stackoverflow.com/a/24634454
  MongoClient.connect( "mongodb://localhost:27017/tp1", function( err, db ) {
    _db = db;
    return callback( err );
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
      collection.insert(data, function (err, result) {
        if (err) {
          console.log("Erreur lors de l'insertion de " + data, err);
        } else {
          console.log(data.length + " documents added to the db in installations");
        }
        callback(err);
      });
    }
  });
}

exports.exists = function(err, document, callback) {
  var db = getDb();

  db.collection("installations", function (err, collection) {
    if (err) {
      console.log("Erreur avec la base de données.", err);
      db.close();
    } else {
      fields = Object.keys(document);
      collection.findOne(document, fields, function (err, document) {
        if (err) {
          db.close()
          console.log("Erreur lors de la recherche.", err);
          callback(err);
        } else {
          callback(err, document);
        }
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
        query._id = ObjectID(query._id);
      }
      collection.find(query, fields, function (err, result) {
        console.log("IN DB!:" + JSON.stringify(fields));
        if (err) {
          db.close();
          console.log("Erreur lors de la recherche.", err);
          callback(err);
        } else {
          var results = result.toArray();
          results
            .then(function (res) {
              callback(err, res);
            })
            .catch(function (err) {
              callback(err);
            });
        }
      });
    }
  });
}