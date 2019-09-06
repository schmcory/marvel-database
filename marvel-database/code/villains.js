module.exports = function(){
	var express = require('express');
	var router = express.Router();
	
/* ------------------------------------------ FUNCTIONS ------------------------------------------ */
	
	/* FUNCTION TO GET ALL HEROES FOR THE ENEMY MENU DROPDOWN */
	function getHeroes(res, mysql, context, complete){
		mysql.pool.query("SELECT hero_id AS id, alias FROM Heroes", function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}
			
			context.heroes = results;
			complete();	
		});
	}

	/* FUNCTION TO GET ALL VILLAINS TO DISPLAY */
	function getVillains(res, mysql, context, complete){
		mysql.pool.query("SELECT villain_id AS id, vfirstName, vlastName, vspecies, vage, valias, Heroes.alias AS enemy FROM Villains INNER JOIN Heroes ON enemy = Heroes.hero_id", function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}	
			context.villains = results;
			complete();
		});
	}
	
	/* FUNCTION TO GET VILLAIN BY ENEMY */
	function getVillainByEnemy(res, mysql, context, complete) {
		var query = "SELECT Villains.villain_id AS id, vfirstName, vlastName, vspecies, vage, valias, Heroes.alias AS enemy FROM Villains INNER JOIN Heroes ON enemy = Heroes.hero_id WHERE Villains.enemy = ?";
		console.log(req.params)
		var inserts = [req.params.enemy]
		mysql.pool.query(query, inserts, function(error, results, fields) {
			if(error) {
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}
			context.villains = results;
			complete();
		});
	}
	
	/* FUNCTION TO GET VILLAIN ALIAS*/
	function getVillainWithAliasLike(res, mysql, context, complete) {
		var query = "SELECT Villains.villain_id AS id, vfirstName, vlastName, vspecies, vage, valias, Heroes.alias AS enemy FROM Villains INNER JOIN Heroes ON enemy = Heroes.hero_id WHERE Villains.valias LIKE " + mysql.pool.escape(req.params.s + '%');
		console.log(query)
		mysql.pool.query(query, function(error, results, fields){
			if(error) {
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}
			context.villains = results;
			complete();
		});
	}
	
	/* FUNCTION TO GET ONE, SINGLE HERO */
	function getVillain(res, mysql, context, id, complete) {
		var sql = "SELECT villain_id AS id, vfirstName, vlastName, vspecies, vage, valias, enemy FROM Villains WHERE villain_id = ?";
		var inserts =[id];
		
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();	
			}
			context.villain = results[0];
			complete();
		});			
	}
	
/* ------------------------------------------ ROUTERS ------------------------------------------ */
	
	/* ROUTER TO DISPLAY VILLAINS */
	router.get('/', function(req, res) {
	var callbackCount = 0;
	var context = {};
	context.jsscripts = ["deleteVillain.js"];
	var mysql = req.app.get('mysql');
	getHeroes(res, mysql, context, complete);
	getVillains(res, mysql, context, complete);
	function complete() {
		callbackCount++;
		if(callbackCount >= 2) {
			res.render('villains', context);
		
		}
	}
	});
	
	/* ROUTER TO DISPLAY HEROES FOR SEARCH */
	router.get('/search/:s', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["deleteVillain.js"];
		var mysql = req.app.get('mysql');
		getVillainsWithAliasLike(req, res, mysql, context, complete);
		getHeroes(res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if(callbackCount >= 2) {
				res.render('villains', context);
			}
		}
	});
	
	/* ROUTER TO DISPLAY ONE VILLAIN TO UPDATE */ //FIX//
	router.get('/:villain_id', function(req, res){
		callbackCount = 0;
		var context = {};
		context.jsscripts = ["selectedHero.js", "updateVillain.js"];
		var mysql = req.app.get('mysql');
		getVillain(res, mysql, context, req.params.villain_id, complete);
		getHeroes(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 2){
				//FIX
				res.render('update-villain', context);
			}
		}
	});
	 		
	/* ROUTER TO ADD NEW VILLAIN */
	router.post('/', function(req, res) {
		console.log(req.body.enemy);
		console.log(req.body);
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Villains(vfirstName, vlastName, vspecies, vage, valias, enemy) VALUES (?, ?, ?, ?, ?, ?)";
		var inserts = [req.body.vfirstName, req.body.vlastName, req.body.vspecies, req.body.vage, req.body.valias, req.body.enemy];
		sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
			if(error) {
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end;
			} else {
				console.log("VILLAIN ADDED TO THE DATABASE");
				res.redirect('/villains')
			}
		});
	});
	
	/* THE URI THAT UPDATES DATA SENT TO UPDATE THE VILLAIN */
	router.put('/:id', function(req, res) {
		var mysql = req.app.get('mysql');
		console.log(req.body)
		console.log(req.params.id)
		var sql = "UPDATE Villains SET vfirstName = ?, vlastName = ?, vspecies = ?, vage = ?, valias = ?, enemy = ? WHERE villain_id = ?";
		var inserts = [req.body.vfirstName, req.body.vlastName, req.body.vspecies, req.body.vage, req.body.valias, req.body.enemy, req.params.id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
			if(error) {
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			} else {
				res.status(200);
				res.end();
				console.log("Updated Villain");
			}
		});		
	});
	
	/* ROUTER TO DELETE HERO */
	router.delete('/:id', function(req, res) {
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM Villains WHERE villain_id = ?";
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