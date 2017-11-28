exports.trim = function(err, data, callback) {
  for (var i = 0; i < data.length; i++) {
    data[i].Nom = data[i].Nom.trim(); 
    data[i].Condition = data[i].Condition.trim(); 
    data[i].Arrondissement = data[i].Arrondissement.trim();
    data[i].Addresse = data[i].Addresse.trim();
  }
   callback(err, data);
}