var fetchAllData = require('./helpers/fetch-all-data.js').fetchAllData;
var db = require('./db/db.js');
db.connectToServer(function(err) {
    fetchAllData(err, function(err){
        process.exit(0);
    });
});