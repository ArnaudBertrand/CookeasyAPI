var Hapi = require('hapi');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({ 
  host: '0.0.0.0', 
  port: +process.env.PORT,
  routes: {cors: true}
});

server.route({
  method: 'GET',
  path:'/hello', 
  handler: function (request, reply) {
    reply('hello world');
    console.log('test');
  }
});

// Start the server
server.start();

// Add the route
server.route(
  {
    method: 'GET',
    path:'/', 
    handler: function (request, reply) {
      reply('test');
    }
  },
  {
    method: 'GET',
    path:'/hello', 
    handler: function (request, reply) {
      reply('hello world');
      console.log('test');
    }
  });

// Start the server
server.start();