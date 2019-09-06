module.exports = function(){
	var express = require('express');
	var router = express.Router();
	
/* ------------------------------------------ FUNCTIONS ------------------------------------------ */
	
	/* FUNCTION TO GET ALL PLANETS FOR THE HOMEPLANET MENU DROPDOWN */
	function getPlanets(res, mysql, context, complete){
		mysql.pool.query("SELECT planet_id AS id, name FROM Planets", function(error, results, fields){
			if(error){
				console.log(error);
				res.write(JSON.stringify(error));
				res.end();
			}
			
			context.planets = results;
			complete();	
		});
	}

	/* FUNCTION TO GET ALL HEROES TO DISPLAY */
	function getHeroes(res, mysql, context, complete){
		mysql.pool.query("SELECT hero_id AS id, firstName, lastName, species, age, alias, loveInterest, Planets.name AS homePlanet FROM Heroes INNER JOIN Planets ON homePlanet = Planets.planet_id", function(error, results, fields){
			if(error){
				console.log(error);
				res.write(JSON.stringify(error));
				res.end();
			}	
			context.heroes = results;
			complete();
		});
	}
	
	/* FUNCTION TO GET HERO BY HOME PLANET */
	function getHeroByHomePlanet(req, res, mysql, context, complete) {
		var query = "SELECT Heroes.hero_id AS id, firstName, lastName, species, age, alias, loveInterest, Planets.name AS homePlanet FROM Heroes INNER JOIN Planets ON homePlanet = Planets.planet_id WHERE Heroes.homePlanet = ?";
		console.log(req.params)
		var inserts = [req.params.homePlanet]
		mysql.pool.query(query, inserts, function(error, results, fields) {
			if(error) {
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}
			context.heroes = results;
			complete();
		});
	}
	
	/* FUNCTION TO GET HERO BY ALIAS*/
	function getHeroesWithAliasLike(req, res, mysql, context, complete) {
		var query = "SELECT Heroes.hero_id AS id, firstName, lastName, species, age, alias, loveInterest, Planets.name AS homePlanet FROM Heroes INNER JOIN Planets ON homePlanet = Planets.planet_id WHERE Heroes.alias LIKE " + mysql.pool.escape(req.params.s + '%');
		console.log(query)
		mysql.pool.query(query, function(error, results, fields){
			if(error) {
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}
			context.heroes = results;
			complete();
		});
	}
	
	/* FUNCTION TO GET ONE, SINGLE HERO */
	function getHero(res, mysql, context, id, complete) {
		var sql = "SELECT hero_id AS id, firstName, lastName, species, age, alias, loveInterest, homePlanet FROM Heroes WHERE hero_id = ?";
		var inserts =[id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();	
			}
			context.hero = results[0];
			complete();
		});			
	}
	
/* ------------------------------------------ ROUTERS ------------------------------------------ */
	
	/* ROUTER TO DISPLAY HEROES */
	router.get('/', function(req, res) {
	var callbackCount = 0;
	var context = {};
	context.jsscripts = ["deleteHero.js", "filterHero.js", "searchHero.js"];
	var mysql = req.app.get('mysql');
	getHeroes(res, mysql, context, complete);
	getPlanets(res, mysql, context, complete);
	function complete() {
		callbackCount++;
		if(callbackCount >= 2) {
			res.render('heroes', context);
		}
	}
	});
	
	/* ROUTER TO DISPLAY HEROES FROM A HOME PLANET */
	router.get('/filter/:homePlanet', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["deleteHero.js", "filterHero.js", "searchHero.js"];
		var mysql = req.app.get('mysql');
		getHeroByHomePlanet(req, res, mysql, context, complete);
		getPlanets(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 2){
				res.render('heroes', context);
			}
		}
	});
	
	/* ROUTER TO DISPLAY HEROES FOR SEARCH */
	router.get('/search/:s', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["deleteHero.js", "filterHero.js", "searchHero.js"];
		var mysql = req.app.get('mysql');
		getHeroesWithAliasLike(req, res, mysql, context, complete);
		getPlanets(res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if(callbackCount >= 2) {
				res.render('heroes', context);
			}
		}
	});
	
	/* ROUTER TO DISPLAY ONE HERO TO UPDATE */
	router.get('/:hero_id', function(req, res){
		callbackCount = 0;
		var context = {};
		context.jsscripts = ["selectedPlanet.js", "updateHero.js"];
		var mysql = req.app.get('mysql');
		getHero(res, mysql, context, req.params.hero_id, complete);
		getPlanets(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 2){
				//FIX
				res.render('update-hero', context);
			}
		}
	});
	 		
	/* ROUTER TO ADD NEW HERO */
	router.post('/', function(req, res) {
		console.log(req.body.homePlanet)	
		console.log(req.body);
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Heroes(firstName, lastName, species, age, alias, loveInterest, homePlanet) VALUES (?, ?, ?, ?, ?, ?, ?)";
		var inserts = [req.body.firstName, req.body.lastName, req.body.species, req.body.age, req.body.alias, req.body.loveInterest, req.body.homePlanet];
		sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
			if(error) {
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end;
			} else {
				console.log("HERO ADDED TO THE DATABASE");
			}
		});
	});
	
	/* THE URI THAT UPDATES DATA SENT TO UPDATE THE HERO */
	router.put('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		console.log(req.body)
		console.log(req.params.id)
		var sql = "UPDATE Heroes SET firstName = ?, lastName = ?, species = ?, age = ?, alias = ?, loveInterest = ?, homePlanet = ? WHERE hero_id = ?";
		var inserts = [req.body.firstName, req.body.lastName, req.body.species, req.body.age, req.body.alias, req.body.loveInterest, req.body.homePlanet, req.params.id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
			if(error) {
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			} else {
				res.status(200);
				res.end();
				console.log("Updated Hero");
			}
		});		
	});
	
	/* ROUTER TO DELETE HERO */
	router.delete('/:id', function(req, res) {
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM Heroes WHERE hero_id = ?";
		var inserts = [req.params.id];
		sql = mysql.pool.query(sql, inserts, function (error, results, fields){
			if(error) {
				res.write(JSON.stringify(error));
				console.log(JSON.stringify(error));
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