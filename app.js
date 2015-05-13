var Hapi = require('hapi');
var Bcrypt = require('bcrypt');
var Basic = require('hapi-auth-basic');
var Joi = require('joi');
var Mongoose = require('mongoose');

var handlers = {};
var configs = {};

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({ 
  host: '0.0.0.0', 
  port: +process.env.PORT,
  routes: {cors: true}
});

// Routes handlers
handlers.get = function (request, reply) {
  reply('Home page');
};

handlers.contact = function (request, reply) {
  reply('Contact page');
  console.log('test');
};

handlers.userLogin = function(request, reply){
  console.log(request.payload);
  console.log(request.payload.password);
  console.log(request.payload["password"]);
  reply(request.payload.password + ' ' + request.payload.username);
};

handlers.test = function(request, reply){
  console.log(request.payload);
  console.log('test ok')
}
configs.userLogin = {
  validate: { payload: {
  	  username: Joi.string().min(3),
      password: Joi.string().min(3)
  }}};

// Routes definitions
server.route([
  { method: 'GET', path:'/', handler: handlers.get },
  { method: 'POST', path:'/user/login', handler: handlers.userLogin, config: configs.userLogin},
  { method: 'GET', path:'/hello', handler: handlers.contact }
]);

// Start the server
server.start(function(){ console.log('Server started at [' + server.info.uri + ']'); });

// Validation
var validate = function(username,password,callback){
	// Find usernname
	var user = User.find({});
	if(!user){
		return callback(null,false);
	}

	Bcrypt.compare(password,user.password, function(err, isValid){
	  callback(err, isValid, {id: user.id, username: user.username});
	});
};

// Authentication
server.register(require('hapi-auth-basic'), function (err) {
    server.auth.strategy('simple', 'basic', { validateFunc: validate });
    server.route({ method: 'GET', path: '/test', handler: handlers.test, config: { auth: 'simple' } });
});

// Connect to database
Mongoose.connect('mongodb://cookeasyapi:apiPASSWORD@ds061731.mongolab.com:61731/heroku_app36784651');
var db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log("Connection with database succeeded.");
});

var userSchema = Mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});
var User = Mongoose.model('users',userSchema);