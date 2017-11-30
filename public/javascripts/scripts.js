function searchByText() {
  var borough = document.getElementById('borough-field').value;
  var url = '/installations?arrondissement=' + borough;
  search(url);
}

function searchByDropdown() {
  var e = document.getElementById('search-dropdown');
  var id = e.options[e.selectedIndex].value;
  var url = '/installations/' + id;
  search(url);
}

function search(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var installations = JSON.parse(xhr.responseText);
        var trHTML = '<thead><tr><th>Type d\'installation</th><th>Nom</th><th>Description</th><th>Arrondissement</th><th>Addresse</th><th>Condition</th></tr></thead><tbody>';
        $.each(installations, function (i, installation) {
          trHTML += '<tr><td>' 
            + installation.Type + '</td><td>' 
            + installation.Nom + '</td><td>' 
            + installation.Description + '</td><td>' 
            + installation.Arrondissement + '</td><td>' 
            + installation.Addresse + '</td><td>' 
            + installation.Condition + '</td></tr>';
        });
        trHTML += '</tbody>'
        $('#search-results').html(trHTML)
                            .css('visibility','');
      } else {
        alert('Erreur');
      }
    }
  };
  xhr.send();

  return false;
}

$(document).ready(function() {
  $('form').submit(function(e) {
      e.preventDefault(e);
  });
});