var mysql = require('./dbcon.js');
var express = require('express');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

var app = express();
app.set('port', 9401);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/static', express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('mysql', mysql);

app.use('/planets', require('./planets.js'));
app.use('/heroes', require('./heroes.js'));
app.use('/villains', require('./villains.js'));
app.use('/teams', require('./teams.js'));
app.use('/abilities', require('./abilities.js'));
app.use('/heroes-teams', require('./heroes-teams.js'));
app.use('/heroes-abilities', require('./heroes-abilities.js'));

app.get('/', function(req,res){
    var context = {};
    res.render('index', context);
});


app.use(function(req,res){
  res.status(404);
  res.render('404');
});


app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://flip1.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.'); 
});