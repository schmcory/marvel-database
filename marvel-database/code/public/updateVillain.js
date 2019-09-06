function updateVillain(id) {
	$.ajax({
		url: '/villains/' + id,
		type: 'PUT',
		data: $('#update-villain').serialize(),
		success: function(result) {
			window.location.replace("./");
		}
	})
};