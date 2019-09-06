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
	function getAbilities(res, mysql, context, complete){
		mysql.pool.query("SELECT ability_id AS aid, name FROM Abilities", function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}
			
			context.abilities = results;
			complete();	
		});
	}
	
	/* FUNCTION TO GET HEROES WITH THEIR ABILITIES */ //FIX//
	function getHeroesWithAbilities(res, mysql, context, complete) {
		var query = "SELECT hid, aid, alias AS hero, name AS ability FROM Heroes INNER JOIN AbilityMembers on Heroes.hero_id = AbilityMembers.hid INNER JOIN Abilities ON Abilities.ability_id = AbilityMembers.aid ORDER BY alias, ability"
		mysql.pool.query(query, function(error, results, fields){
			if(error) {
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}
			context.heroes_with_abilities = results;
			complete();
		});
	}
		
/* ------------------------------------------ ROUTERS ------------------------------------------ */
	
	/* ROUTER TO HEROES AND THEIR ABILITIES */
	router.get('/', function(req, res) {
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["deleteHero.js"];
		var mysql = req.app.get('mysql');
		getHeroes(res, mysql, context, complete);
		getAbilities(res, mysql, context, complete);
		getHeroesWithAbilities(res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if(callbackCount >= 3) {
				res.render('heroes-abilities', context);
		
			}
		}
	});
	
	/* ROUTER TO ASSOCIATE A HERO WITH AN ABILITY */
	router.post('/', function(req, res){
		console.log(req.body.names)
		var mysql = req.app.get('mysql');
		var abilities = req.body.names
		var hero = req.body.hid
		for(let name of abilities) {
			console.log("Processing ability id" + name)
			var sql = "INSERT INTO AbilityMembers (hid, aid) VALUES (?, ?)";
			var inserts = [hero, name];
			sql = mysql.pool.query(sql, inserts, function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
					console.log(error)
				}
			});
		}
		res.redirect('/heroes-abilities');
	});
	
	/* ROUTER TO DELETE HERO */
	router.delete('/hid/:hid/name/:aid', function(req, res) {
		console.log(req.params.hid)
		console.log(req.params.aid)
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM AbilityMembers WHERE hid = ? AND aid = ?";
		var inserts = [req.params.hid, req.params.aid];
		sql = mysql.pool.query(sql, inserts, function (error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.status(400);
				res.end();
			}else{
				res.status(202).end();
			}
		})
	})	
	
return router;

}();