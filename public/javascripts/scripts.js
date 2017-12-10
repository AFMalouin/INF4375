// Gets the bourough text input value and sends it to search()
function searchByText() {
  var borough = document.getElementById('borough-field').value;
  var route = '/installations?arrondissement=' + borough;
  search(route);
}

// Gets the installation name dropdown value and sends it to search()
function searchByDropdown() {
  var e = document.getElementById('search-dropdown');
  var id = e.options[e.selectedIndex].value;
  var route = '/installations/' + id;
  search(route);
}

/* Makes the ajax call to get the search results and 
*  creates the results table
* Params
*   route: The route on which to send the ajax call
*/
function search(route) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', route);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var installations = JSON.parse(xhr.responseText);

        // If a single installation is returned, put it in
        // an array so we can iterate
        if (!Array.isArray(installations)) {
          installations = [installations];
        }
        var trHTML = '<thead><tr><th>Type d\'installation</th>'
          + '<th>Nom</th>' 
          + '<th>Description</th>'
          + '<th>Arrondissement</th>'
          + '<th>Addresse</th>' 
          + '<th>Condition</th></tr></thead><tbody>';
        $.each(installations, function (i, installation) {
          trHTML += '<tr><td>' 
            + installation.type + '</td><td>' 
            + installation.nom + '</td><td>' 
            + installation.description + '</td><td>' 
            + installation.arrondissement + '</td><td>' 
            + installation.addresse + '</td><td>' 
            + installation.condition + '</td></tr>';
        });
        trHTML += '</tbody>'
        $('#search-results').html(trHTML)
                            .css('visibility','');
      } else {
        alert('Erreur ' + xhr.status + " : " + xhr.statusText);
      }
    }
  };
  xhr.send();

  return false;
}

// Prevents default HTML forms behavior
$(document).ready(function() {
  $('form').submit(function(e) {
      e.preventDefault(e);
  });
});