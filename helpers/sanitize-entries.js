exports.trim = function(err, data, callback) {
  try{
    for (var i = 0; i < data.length; i++) {
      data[i].Nom = data[i].Nom.trim(); 
      data[i].Condition = data[i].Condition.trim(); 
      data[i].Arrondissement = data[i].Arrondissement.trim();
      data[i].Addresse = data[i].Addresse.trim();
    }
    callback(err, data);
  } catch(err) {
    console.log(err);
    callback(err);
  }
}