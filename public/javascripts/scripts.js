function searchByText() {
  var borough = document.getElementById('borough-field').value;
  var url = '/installations?arrondissement=' + borough + '&ajax='+ 'true';
  search(url);
}

function searchByDropdown() {
  var e = document.getElementById("search-dropdown");
  var id = e.options[e.selectedIndex].value;
  var url = '/installations/' + id + '?ajax='+ 'true';
  search(url);
}

function search(url){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
         document.getElementById('search-results').innerHTML = xhr.responseText;
      } else {
        alert('Erreur');
      }
    }
  };
  xhr.send();

  return false;
}