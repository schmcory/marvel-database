function deleteHero(id){
	$.ajax({
		url: '/heroes/' + id,
		type: 'DELETE',
		success: function(result){
		window.location.reload(true);
		}
	})
};

function deleteHeroAbility(hid, aid){
	$.ajax({
		url: '/heroes-abilities/hid/' + hid + '/name/' + aid,
		type: 'DELETE',
		success: function(result){
			if(result.responseText != undefined){
				alert(result.responseText)
			}else{
				window.location.reload(true);	
			}
		}
	})
};

function deleteTeamHero(hid, tid){
	$.ajax({
		url: '/heroes-teams/hid/' + hid + '/name/' + tid,
		type: 'DELETE',
		success: function(result){
			if(result.responseText != undefined){
				alert(result.responseText)
			}else{
				window.location.reload(true);	
			}
		}
	})
};
