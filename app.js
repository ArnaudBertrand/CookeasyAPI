var fs = require('fs'),
    express = require('express'),
    Mongoose = require('mongoose'),
    config = {};

config.express = require('./config/express.js');

var app = express();
var port = process.env.PORT || 3000;

var connect = function (){
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  var url = 'mongodb://cookeasyapi:apiPASSWORD@ds061731.mongolab.com:61731/heroku_app36784651';
  Mongoose.connect(url,options);

};
connect();

var db = Mongoose.connection;
db.on('error', console.log);
db.on('disconnected', connect);

db.once('open', function callback() {
  console.log("Connection with database succeeded.");
});

// Bootstrap models
fs.readdirSync(__dirname + '/mongoose').forEach(function (file) {
  console.log(file);
  if (~file.indexOf('.js')) require(__dirname + '/mongoose/' + file);
});

config.express(app);

require('./routes')(app);

app.listen(port);