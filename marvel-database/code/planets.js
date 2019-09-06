module.exports = function(){
	var express = require('express');
	var router = express.Router();
	
/* ------------------------------------------ FUNCTIONS ------------------------------------------ */
	

	/* FUNCTION TO GET ALL PLANETS TO DISPLAY */
	function getPlanets(res, mysql, context, complete){
		mysql.pool.query("SELECT planet_id AS id, name, populationSize FROM Planets", function(error, results, fields){
			if(error){
				console.log(error);
				res.write(JSON.stringify(error));
				res.end();
			}	
			context.planets = results;
			complete();
		});
	}
	
	/* FUNCTION TO GET ONE, SINGLE PLANET */ //FIX//
	function getPlanet(res, mysql, context, id, complete) {
		var sql = "SELECT planet_id AS id, name, populationSize FROM Planets WHERE planet_id = ?";
		var inserts =[id];
		
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();	
			}
			context.planet = results[0];
			complete();
		});			
	}
	
/* ------------------------------------------ ROUTERS ------------------------------------------ */
	
	/* ROUTER TO DISPLAY PLANETS */
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["deletePlanet.js"];
		var mysql = req.app.get('mysql');
		getPlanets(res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if(callbackCount >= 1){
			res.render('planets', context);
			}
		}
	});
	
	/* ROUTER TO DISPLAY ONE PLANET TO UPDATE */ //FIX//
	router.get('/:planet_id', function(req, res){
		callbackCount = 0;
		var context = {};
		context.jsscripts = ["updatePlanet.js"];
		var mysql = req.app.get('mysql');
		getPlanet(res, mysql, context, req.params.planet_id, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				res.render('update-planet', context);
			}
		}
	});
	 		
	/* ROUTER TO ADD NEW PLANET */
	router.post('/', function(req, res) {
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Planets(name, populationSize) VALUES (?, ?)";
		console.log(req.body);
		var inserts = [req.body.name, req.body.populationSize];
		sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
			if(error) {
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end;
			}else {
				console.log("PLANET ADDED TO THE DATABASE");
				res.redirect('/planets')
			}
		});
	});
	
	/* THE URI THAT UPDATES DATA SENT TO UPDATE THE PLANET */
	router.put('/:id', function(req, res) {
		var mysql = req.app.get('mysql');
		var sql = "UPDATE Planets SET name = ?, populationSize = ? WHERE planet_id = ?";
		var inserts = [req.body.name, req.body.populationSize, req.params.id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
			if(error) {
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			} else {
				res.status(200);
				res.end();
				console.log("Updated Planet");
			}
		});		
	});
	
	/* ROUTER TO DELETE PLANET */
	router.delete('/:id', function(req, res) {
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM Planets WHERE planet_id = ?";
		var inserts = [req.params.id];
		sql = mysql.pool.query(sql, inserts, function (error, results, fields){
			if(error) {
				console.log(error);
				console.log(JSON.stringify(error));
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