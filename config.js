var config = {};

config.db = {};

// For use when setting up the projet on localhost
config.db.local = {
  port : '27017',
  name : 'tp1'
};
config.db.local.address = 'mongodb://localhost:' + config.db.local.port + '/' + config.db.local.name;

// For use when deploying on Heroku
config.db.heroku = {
  port : '51163',
  name : 'heroku_903wz95w'
};
config.db.heroku.address = 'mongodb://arnaud:jberger@ds151163.mlab.com:' + config.db.heroku.port + '/' + config.db.heroku.name;

config.db.mainCollection = 'installations';

config.cron = {
  hour : 00,
  minute : 00
};

config.devPort = '3000';
config.favicon = 'favicon.ico';

// Fields of normalized installations
config.fields = {
  id :'_id',
  object :'installation',
  type :'type',
  name :'nom',
  description :'description',
  condition :'condition',
  borough :'arrondissement',
  address :'addresse'
};

// Different types of supported installations
config.types = {
  pool : 'Piscine',
  rink : 'Arena',
  slide : 'Glissade'
};

config.getPoolsOptions = {
  host: 'donnees.ville.montreal.qc.ca',
  port: 80,
  path:'/dataset/4604afb7-a7c4-4626-a3ca-e136158133f2/resource/cbdca706-569e-4b4a-805d-9af73af03b14/download/piscines.csv'
};

config.getRinksOptions = {
  host: 'www2.ville.montreal.qc.ca',
  port: 80,
  path:'/services_citoyens/pdf_transfert/L29_PATINOIRE.xml'
};

config.getSlidesOptions = {
  host: 'www2.ville.montreal.qc.ca',
  port: 80,
  path:'/services_citoyens/pdf_transfert/L29_GLISSADE.xml'
};

config.appTitle = 'Projet installations';

module.exports = config;