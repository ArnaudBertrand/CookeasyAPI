var Mongoose = require('mongoose');
var User = require('./mongoose/user.js');

// Connect to database
Mongoose.connect('mongodb://cookeasyapi:apiPASSWORD@ds061731.mongolab.com:61731/heroku_app36784651');
var db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log("Connection with database succeeded.");
});

module.exports = {connection: db, User: User};