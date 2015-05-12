var Hapi = require('hapi');
var Joi = require('Joi');
var internals = {};
var configs = {};

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({ 
  host: '0.0.0.0', 
  port: +process.env.PORT,
  routes: {cors: true}
});

internals.get = function (request, reply) {
  reply('Home page');
};

internals.contact = function (request, reply) {
  reply('Contact page');
  console.log('test');
};

internals.userLogin = function(request, reply){
  console.log(request.payload);
  console.log(request.payload.password);
  console.log(request.payload["password"]);
  reply(request.payload.password + ' ' + request.payload.username);
}

configs.userLogin = {
  validate: { payload: {
  	  username: Joi.string().min(3),
      password: Joi.string().min(3)
  }}};

// Add the route
server.route([
  { method: 'GET', path:'/', handler: internals.get },
  { method: 'POST', path:'/user/login', handler: internals.userLogin, config: configs.userLogin},
  { method: 'GET', path:'/hello', handler: internals.contact }
]);

// Start the server
server.start(function(){ console.log('Server started at [' + server.info.uri + ']'); });