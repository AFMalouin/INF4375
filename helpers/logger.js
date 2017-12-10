/* Logs an error
* Params
*   err: Error object
*   status: HTTP status code to give the error
*/
exports.log = function(err, status) {
  if (!err.isLogged) {
    err.status = status;
    console.log(err);
    err.isLogged = true;
  }
  return;
}