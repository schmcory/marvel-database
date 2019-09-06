function updateAbility(id) {
	$.ajax({
		url: '/abilities/' + id,
		type: 'PUT',
		data: $('#update-ability').serialize(),
		success: function(result) {
			window.location.replace("./");
		}
	})
};