function searchHeroesByAlias() {
//get the alias
var alias_search_string = document.getElementById('alias_search_string').value

//construct the URL and redirect to it
window.location = '/heroes/search/' + encodeURI(alias_search_string)
}