var Hapi = require('hapi');

// Create a server with a host and port
var server = new Hapi.Server(+process.env.PORT, '0.0.0.0');
server.connection({ 
  routes: {cors: true}
});

// Add the route
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