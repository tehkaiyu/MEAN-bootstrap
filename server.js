// modules =================================================
var path            = require('path');
var express        	= require('express');
var mongoose       	= require('mongoose');
var passport 		= require('passport');
var flash    		= require('connect-flash');

var morgan       	= require('morgan');
var cookieParser 	= require('cookie-parser');
var bodyParser     	= require('body-parser');
var session      	= require('express-session');
var methodOverride 	= require('method-override');
var app            	= express();
var api 			= require('./app/api/crud');

// configuration ===========================================
var config          = require('./config/base');
var db 				= require('./config/db');

// mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)
// require('./config/passport')(passport); // pass passport for configuration


// get all data/stuff of the body (POST) parameters
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: 'somesecretkey' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));
app.use('/api', api);

// routes ==================================================
require('./app/routes')(app, passport);
require('./app/socket')(config);

// start app ===============================================
app.listen(config.port);	
console.log('Magic happens on port ' + config.port); 			// shoutout to the user
exports = module.exports = app; 						// expose app