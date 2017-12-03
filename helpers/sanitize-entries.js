/* Trim data from all fields of an array of installations
*   Params
*     err: The error object
*     data: The array of installations to trim
*     callback: Returns the error object and the
*               trimmed array of installations
*/
exports.trim = function(err, data, callback) {
  try{
    for (var i = 0; i < data.length; i++) {
      data[i].nom = data[i].nom.trim();
      data[i].description = data[i].description.trim();
      data[i].condition = data[i].condition.trim(); 
      data[i].arrondissement = data[i].arrondissement.trim();
      data[i].addresse = data[i].addresse.trim();
    }
    callback(err, data);
  } catch(err) {
    console.log(err);
    callback(err);
  }
}