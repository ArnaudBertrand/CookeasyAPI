var Hapi = require('hapi');
var Bcrypt = require('bcrypt');
var Basic = require('hapi-auth-basic');
var Joi = require('joi');
var Mongoose = require('mongoose');
var User = require('./mongoose/user.js');

var internals = {};
var configs = {};

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({ 
  host: '0.0.0.0', 
  port: +process.env.PORT,
  routes: {cors: true}
});

// Routes handlers
internals.get = function (request, reply) {
  reply('Home page');
};

internals.contact = function (request, reply) {
  reply('Contact page');
  console.log('test');
};

internals.userLogin = function(request, reply){
  User.findOne({username: request.payload.username}, function(err,user){
    var error = null;
    if(err){
      error = err;
    }
    if(!user){
      error = 'User not found';
    }

    user.comparePassword(request.payload.password, function(err, isValid){
      if(err){
        error = err;
      } else if(!isValid){
        error = "Wrong password";
      }
    });

    if(error !== null){
      reply({success: false, error: err});
    } else{
      reply({success: true});
    }
  });
};

internals.userSignup = function(request, reply){  
  var newUser = new User({username: request.payload.username, password: request.payload.username});
  newUser.save(function(err){
    if(err){
      reply({saved: false, error: err});
    } else{
      reply({saved: true});
    }
  });
};

internals.test = function(request, reply){
  console.log(request.payload);
  console.log('test ok')
}

// Routes configurations
configs.userLogin = {
  validate: { payload: {
      username: Joi.string().min(3),
      password: Joi.string().min(3)
  }}};

configs.userSignup = {
  validate: { payload: {
      username: Joi.string().min(3),
      password: Joi.string().min(3)
  }}};

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

// Connect to database
Mongoose.connect('mongodb://cookeasyapi:apiPASSWORD@ds061731.mongolab.com:61731/heroku_app36784651');
var db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log("Connection with database succeeded.");
});