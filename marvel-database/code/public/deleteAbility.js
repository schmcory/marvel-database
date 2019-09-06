function deleteAbility(id) {
	$.ajax({
	url: '/abilities/' + id,
	type: 'DELETE',
	success: function(result) {
		window.location.reload(true);
	}
	})
};