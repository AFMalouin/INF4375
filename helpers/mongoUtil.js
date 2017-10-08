// https://stackoverflow.com/a/24634454

var MongoClient = require('mongodb').MongoClient;

var _db;
module.exports = {
  connectToServer: function( callback ) {
    MongoClient.connect( "mongodb://localhost:27017/tp1", function( err, db ) {
      _db = db;
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }
};