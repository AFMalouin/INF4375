var config = {}

config.db = {}

// For use when setting up the projet on localhost
config.db.local = {
    port : '27017',
    name : 'tp1',
}
config.db.local.address = 'mongodb://localhost:' + config.db.local.port + '/' + config.db.local.name;

// For use when deploying on Heroku
config.db.heroku = {
    port : '31715',
    name : 'heroku_wdk79gdg',
}
config.db.heroku.address = 'mongodb://heroku_wdk79gdg:avd3h0ujeb8bbrjjk4nbectibo@ds231715.mlab.com:' + config.db.heroku.port + '/' + config.db.heroku.name;

config.db.maincollection = 'installations';

config.cron = {
    hour: 00
}

config.devPort = '3000';
config.favicon = 'favicon.ico'

config.fields = {}
config.fields.id = '_id';
config.fields.object = 'Installation'
config.fields.type = 'Type';
config.fields.name = 'Nom';
config.fields.condition = 'Condition';
config.fields.borough = 'Arrondissement';
config.fields.address = 'Addresse';

config.cron.hour = 00;

config.appTitle = 'Projet installations';

module.exports = config;