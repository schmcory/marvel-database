module.exports = function(){
	var express = require('express');
	var router = express.Router();
	
/* ------------------------------------------ FUNCTIONS ------------------------------------------ */
	

	/* FUNCTION TO GET ALL TEAMS TO DISPLAY */
	function getTeams(res, mysql, context, complete){
		mysql.pool.query("SELECT team_id AS id, name, size FROM Teams", function(error, results, fields){
			if(error){
				console.log(error);
				res.write(JSON.stringify(error));
				res.end();
			}	
			context.teams = results;
			complete();
		});
	}
	
	/* FUNCTION TO GET ONE, SINGLE TEAM */ //FIX//
	function getTeam(res, mysql, context, id, complete) {
		var sql = "SELECT team_id AS id, name, size FROM Teams WHERE team_id = ?";
		var inserts =[id];
		
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();	
			}
			context.team = results[0];
			complete();
		});			
	}
	
/* ------------------------------------------ ROUTERS ------------------------------------------ */
	
	/* ROUTER TO DISPLAY TEAMS */
	router.get('/', function(req, res) {
	var callbackCount = 0;
	var context = {};
	context.jsscripts = ["deleteTeam.js"];
	var mysql = req.app.get('mysql');
	getTeams(res, mysql, context, complete);
	function complete() {
		callbackCount++;
		if(callbackCount >= 1) {
			res.render('teams', context);
		
		}
	}
	});
	
	/* ROUTER TO DISPLAY ONE TEAM TO UPDATE */
	router.get('/:team_id', function(req, res){
		callbackCount = 0;
		var context = {};
		context.jsscripts = ["updateTeam.js"];
		var mysql = req.app.get('mysql');
		getTeam(res, mysql, context, req.params.team_id, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('update-team', context);
			}
		}
	});
	 		
	/* ROUTER TO ADD NEW TEAM */
	router.post('/', function(req, res) {
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Teams(name, size) VALUES (?, ?)";
		console.log(req.body);
		var inserts = [req.body.name, req.body.size];
		sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
			if(error) {
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end;
			} else {
				console.log("TEAM ADDED TO THE DATABASE");
				res.redirect('/teams')
			}
		});
	});
	
	/* THE URI THAT UPDATES DATA SENT TO UPDATE THE TEAM */
	router.put('/:id', function(req, res) {
		var mysql = req.app.get('mysql');
		var sql = "UPDATE Teams SET name = ?, size = ? WHERE team_id = ?";
		
		var inserts = [req.body.name, req.body.size, req.params.id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
			if(error) {
				res.write(JSON.stringify(error));
				res.end();
			} else {
				res.status(200);
				res.end();
				console.log("Updated Team");
			}
		});		
	});
	
	/* ROUTER TO DELETE TEAM */
	router.delete('/:id', function(req, res) {
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM Teams WHERE team_id = ?";
		var inserts = [req.params.id];
		sql = mysql.pool.query(sql, inserts, function (error, results, fields){
			if(error) {
				console.log(error);
				res.write(JSON.stringify(error));
				res.status(400);
				res.end();
			}else {
				res.status(202);
				console.log("DELETE CONFIRMED");
				res.end();
			}
		});
	});
	
return router;

}();