module.exports = function(){
	var express = require('express');
	var router = express.Router();
	
/* ------------------------------------------ FUNCTIONS ------------------------------------------ */
	

	/* FUNCTION TO GET ALL ABILITIES TO DISPLAY */
	function getAbilities(res, mysql, context, complete){
		mysql.pool.query("SELECT ability_id AS id, name FROM Abilities", function(error, result, field){
			if(error){
				console.log(error);
				res.write(JSON.stringify(error));
				res.end();
			}	
			context.abilities = result;
			complete();
		});
	}
	
	/* FUNCTION TO GET ONE, SINGLE ABILITY */ //FIX//
	function getAbility(res, mysql, context, id, complete) {
		var sql = "SELECT ability_id AS id, name FROM Abilities WHERE ability_id = ?";
		var inserts =[id];
		
		mysql.pool.query(sql, inserts, function(error, result, field){
			if(error){
				res.write(JSON.stringify(error));
				res.end();	
			}
			context.ability = result[0];
			complete();
		});			
	}
	
/* ------------------------------------------ ROUTERS ------------------------------------------ */
	
	/* ROUTER TO DISPLAY ABILITIES */
	router.get('/', function(req, res) {
	var callbackCount = 0;
	var context = {};
	context.jsscripts = ["deleteAbility.js"];
	var mysql = req.app.get('mysql');
	getAbilities(res, mysql, context, complete);
	function complete() {
		callbackCount++;
		if(callbackCount >= 1) {
			res.render('abilities', context);
		
		}
	}
	});
	
	/* ROUTER TO DISPLAY ONE ABILITY TO UPDATE */ //FIX//
	router.get('/:ability_id', function(req, res){
		callbackCount = 0;
		var context = {};
		context.jsscripts = ["updateAbility.js"];
		var mysql = req.app.get('mysql');
		getAbility(res, mysql, context, req.params.ability_id, complete);
		function complete(){
			callbackCount++;
			if(callbackCount >= 1){
				//FIX
				res.render('update-ability', context);
			}
		}
	});
	 		
	/* ROUTER TO ADD NEW ABILITY */
	router.post('/', function(req, res) {
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO Abilities(name) VALUES (?)";
		console.log(req.body);
		var inserts = [req.body.name];
		sql = mysql.pool.query(sql, inserts, function (error, result, field) {
			if(error) {
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end;
			}else {
				console.log("ABILITY ADDED TO THE DATABASE");
				res.redirect('/abilities')
			}
		});
	});
	
	/* THE URI THAT UPDATES DATA SENT TO UPDATE THE ABILITY */
	router.put('/:id', function(req, res) {
		var mysql = req.app.get('mysql');
		var sql = "UPDATE Abilities SET name = ? WHERE ability_id = ?";
		var inserts = [req.body.name, req.params.id];
		sql = mysql.pool.query(sql, inserts, function(error, result, field) {
			if(error) {
				res.write(JSON.stringify(error));
				res.end();
			} else {
				res.status(200);
				res.end();
				console.log("Updated Ability");
			}
		});		
	});
	
	/* ROUTER TO DELETE ABILITY */
	router.delete('/:id', function(req, res) {
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM Abilities WHERE ability_id = ?";
		var inserts = [req.params.id];
		sql = mysql.pool.query(sql, inserts, function (error, result, field){
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