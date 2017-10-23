function searchByText() {
  var borough = document.getElementById('borough-field').value;
  var url = '/installations?arrondissement=' + borough + '&ajax='+ 'true';
  search(url);
}

function searchByDropdown() {
  var e = document.getElementById("search-dropdown");
  var id = e.options[e.selectedIndex].value;
  var url = '/installations?_id=' + id + '&ajax='+ 'true';
  search(url);
}

function search(url){
  console.log("url: "+url);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
         console.log(xhr.responseText);
        // var results = JSON.parse(xhr.responseText);
        // console.log(results);
         document.getElementById('search-results').innerHTML = xhr.responseText;
      } else {
        alert('Erreur');
      }
    }
  };
  xhr.send();

  return false;
}