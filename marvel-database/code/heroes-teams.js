module.exports = function(){
	var express = require('express');
	var router = express.Router();
	
/* ------------------------------------------ FUNCTIONS ------------------------------------------ */
	
	/* FUNCTION TO GET ALL HEROES FOR THE HERO MENU DROPDOWN */
	function getHeroes(res, mysql, context, complete){
		mysql.pool.query("SELECT hero_id AS hid, alias FROM Heroes", function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}
			
			context.heroes = results;
			//console.log(context.planets);
			complete();	
		});
	}
	
	/* FUNCTION TO GET ALL ABILITIES FOR THE ABILITIES MENU DROPDOWN */
	function getTeams(res, mysql, context, complete){
		mysql.pool.query("SELECT team_id AS tid, name FROM Teams", function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}
			
			context.teams = results;
			complete();	
		});
	}
	
	/* FUNCTION TO GET TEAMS WITH HEROES */ //FIX//
	function getTeamsWithHeroes(res, mysql, context, complete) {
		var query = "SELECT hid, tid, alias AS hero, name AS team FROM Heroes INNER JOIN TeamMembers on Heroes.hero_id = TeamMembers.hid INNER JOIN Teams ON Teams.team_id = TeamMembers.tid ORDER BY alias, team"
		mysql.pool.query(query, function(error, results, fields){
			if(error) {
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}
			context.teams_with_heroes = results;
			complete();
		});
	}
		
/* ------------------------------------------ ROUTERS ------------------------------------------ */
	
	/* ROUTER TO DISPLAY TEAMS WITH THEIR HEROES */ //FIX
	router.get('/', function(req, res) {
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["deleteHero.js"];
		var mysql = req.app.get('mysql');
		getHeroes(res, mysql, context, complete);
		getTeams(res, mysql, context, complete);
		getTeamsWithHeroes(res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if(callbackCount >= 3) {
				res.render('heroes-teams', context);
			}
		}
	});
	
	/* ROUTER TO ASSOCIATE A HERO WITH A TEAM */
	router.post('/', function(req, res){
		console.log(req.body.names)
		var mysql = req.app.get('mysql');
		var teams = req.body.names
		var hero = req.body.hid
		for(let name of teams) {
			console.log("Processing team id" + name)
			var sql = "INSERT INTO TeamMembers (hid, tid) VALUES (?, ?)";
			var inserts = [hero, name];
			sql = mysql.pool.query(sql, inserts, function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
					console.log(error)
				}
			});
		}
		res.redirect('/heroes-teams');
	});
	
	/* ROUTER TO DELETE HERO */
	router.delete('/hid/:hid/name/:tid', function(req, res) {
		console.log(req.params.hid)
		console.log(req.params.tid)
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM TeamMembers WHERE hid = ? AND tid = ?";
		var inserts = [req.params.hid, req.params.tid];
		sql = mysql.pool.query(sql, inserts, function (error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.status(400);
				res.end();
			} else{
				console.log(JSON.stringify(error));
				res.status(202).end();
			}
		})
	})	
	
return router;

}();