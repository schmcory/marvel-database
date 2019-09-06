function deleteVillain(id) {
	$.ajax({
	url: '/villains/' + id,
	type: 'DELETE',
	success: function(result) {
		window.location.reload(true);
	}
	})
};