function updateHero(id) {
	$.ajax({
		url: '/heroes/' + id,
		type: 'PUT',
		data: $('#update-hero').serialize(),
		success: function(result) {
			window.location.replace("./");
		}
	})
};