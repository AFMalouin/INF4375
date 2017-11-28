var config = require('../config.js');
var http = require('http');
var xmlToJson = require('../helpers/format-helpers.js').xmlToJson;
var db = require('../db/db.js');
var _ = require('underscore');

exports.fetchData = function(err, callback) {
  var options = {
    host: 'www2.ville.montreal.qc.ca',
    port: 80,
    path:'/services_citoyens/pdf_transfert/L29_PATINOIRE.xml'
  }
  
  // On initialise la requête http. On spécifie le callback à invoquer lorsque
  // le résultat de la requête sera reçu.
  var request = http.get(options, function (result) {
    // La réponse http a été reçue.
    if (result.statusCode !== 200) {
      err = new Error('HTTP Error: ' + result.statusCode);
      console.log(err);
      callback(err);
    } else {
      var chunks = [];
      result.setEncoding('utf-8');
      
      // La réponse est reçue en plusieurs morceaux et chaque morceau lancera un
      // événement 'data'. Nous allons écouter les événements 'data' et
      // accumuler les fragments de html.
      result.on('data', function (chunk) {
        chunks.push(chunk);
      });

      // Lorsque tous les fragments ont été reçus, l'événement 'end' est
      // invoqué.
      result.on('end', function () {
        var attributes = ['patinoires', 'patinoire'];
        var data = chunks.join('');
        xmlToJson(null, attributes, data, function(err, parsedEntries) {
          if (err){
            callback(err);
          } else {
            normalize(err, parsedEntries, function(err, normalizedDocuments){
              if (normalizedDocuments.length > 0){
                db.save(err, normalizedDocuments, function (err){
                  callback(err);
                });
              } else {
                callback(null);
              }
            });
          }
        });
      });
    }
  });
  
  // En cas d'erreur, on appelle un callback de gestion d'erreur.
  request.on('error', function (err) {
    console.log(err);
    callback(err);
  });
  
  // On envoie la requête http.
  request.end();
}

var normalize = function(err, data, callback){
  var normalizedDocuments = [];
  var remainingDocuments = data.length;
  _.each(data, function(element, index, list){
    var normalizedDocument = {
      Type : config.types.rink,
      Nom : element.nom,
      Condition : element.condition,
      Arrondissement : element.arrondissement.nom_arr,
      Addresse: 'N/A'
    }
    normalizedDocuments.push(normalizedDocument);
    remainingDocuments -= 1;
    if (remainingDocuments == 0){
      callback(err, normalizedDocuments);
    }
  });
}