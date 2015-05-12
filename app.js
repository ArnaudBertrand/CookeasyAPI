var Hapi = require('hapi');
var internals = {};

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
  reply('hello world');
  console.log('test');
};

// Add the route
server.route([
  { method: 'GET', path:'/', handler: internals.get },
  { method: 'GET', path:'/hello', handler: internals.contact }
]);

// Start the server
server.start(function(){ console.log('Server started at [' + server.info.uri + ']'); });