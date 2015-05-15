var Hapi = require('hapi');
var Bcrypt = require('bcrypt');
var Basic = require('hapi-auth-basic');
var Joi = require('joi');
var db = require('./mongoose/mongoose.js');
var internals = require('./config/handlers.js');
var configs = require('./config/configs.js');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({ 
  host: '0.0.0.0', 
  port: +process.env.PORT,
  routes: {cors: true}
});

// Routes definitions
server.route([
  { method: 'GET', path:'/', handler: internals.get },
  { method: 'POST', path:'/user/login', handler: internals.userLogin, config: configs.userLogin},
  { method: 'POST', path:'/user/signup', handler: internals.userSignup, config: configs.userSignup},
  { method: 'GET', path:'/hello', handler: internals.contact }
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
server.register(Basic, function (err) {
    server.auth.strategy('simple', 'basic', { validateFunc: validate });
    server.route({ method: 'GET', path: '/test', handler: internals.test, config: { auth: 'simple' } });
});