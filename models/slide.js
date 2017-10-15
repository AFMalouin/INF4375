var http = require('http');
var xmlToJson = require('../helpers/format-helpers.js').xmlToJson;
var db = require('../db/db.js');
var _ = require('underscore');

exports.fetchData = function getData(err, callback) {
  var options = {
    host: 'www2.ville.montreal.qc.ca',
    port: 80,
    path:'/services_citoyens/pdf_transfert/L29_GLISSADE.xml'
  };
  
  // On initialise la requête http. On spécifie le callback à invoquer lorsque
  // le résultat de la requête sera reçu.
  var request = http.get(options, function (result) {
    // La réponse http a été reçue.
    if (result.statusCode !== 200) {
      callback('HTTP Error: ' + result.statusCode);
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
        var attributes = ['glissades', 'glissade'];
        var data = chunks.join('');
        xmlToJson(null, attributes, data, function(err, parsedEntries) {
          normalize(err, parsedEntries, function(err, normalizedDocuments){
            if (normalizedDocuments.length > 0){
              db.save(err, normalizedDocuments, callback);
            } else {
              callback(null);
            }
          });
        });
      });
    }
  });
  
  // En cas d'erreur, on appelle un callback de gestion d'erreur.
  request.on('error', function (e) {
    callback(e);
  });
  
  // On envoie la requête http.
  request.end();
}

var normalize = function(err, data, callback){
  var normalizedDocuments = [];
  var counter = data.length;
  _.each(data, function(element, index, list){
    var normalizedDocument = {
      type : "slide",
      name : element.nom,
      condition : element.condition,
      borough : element.arrondissement.nom_arr
    }
    db.exists(err, normalizedDocument, function(err, document){
      if (document == null){
        normalizedDocuments.push(normalizedDocument);
      }
      counter = counter - 1;
      if (counter == 0){
        callback(err, normalizedDocuments);
      }
    });
  });
}