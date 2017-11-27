var config = {}

config.db = {}
config.fields = {}

config.db.local = "mongodb://localhost:27017/tp1";
config.db.heroku = "mongodb://heroku_wdk79gdg:avd3h0ujeb8bbrjjk4nbectibo@ds231715.mlab.com:31715/heroku_wdk79gdg";
config.db.maincollection = "installations";

config.fields.id = "_id";
config.fields.object = "Installation"
config.fields.type = "Type";
config.fields.name = "Nom";
config.fields.condition = "Condition";
config.fields.borough = "Arrondissement";
config.fields.address = "Addresse";

module.exports = config;