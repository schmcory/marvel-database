function filterHeroesByHomePlanet() {
	var homeplanet_id = document.getElementById('home_planet_filter').value
	window.location = '/heroes/filter/' + parseInt(homeplanet_id)
}