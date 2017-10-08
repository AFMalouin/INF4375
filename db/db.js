var mongoUtil = require('../helpers/mongoUtil.js');

exports.save = function(err, data, callback) {
  var db = mongoUtil.getDb();

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
            console.log(data.length + " " + collection + " added to the db");
        }
        callback(err);
      });
    }
  });
}

exports.exists = function(err, document, callback) {
  var db = mongoUtil.getDb();

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

exports.find = function(err, query, callback) {
  var db = mongoUtil.getDb();

  db.collection("installations", function (err, collection) {
    if (err) {
      console.log("Erreur avec la base de données.", err);
      db.close();
    } else {
      collection.find(query, function (err, result) {
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