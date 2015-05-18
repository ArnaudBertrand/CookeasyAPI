var express = require('express');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Bcrypt = require('bcrypt');
var internals = require('./config/handlers.js');

var app = express();
var port = process.env.PORT || 3000;

// Set up
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Routes
var router = express.Router();
router.get('/', internals.get);
router.post('/user/login', internals.userLogin);
router.post('/user/signup', internals.userSignup);
router.get('/hello', internals.contact);

app.use('/',router);
// Create a server with a host and port
var server = app.listen(port,function(){
  var host = server.adresses().adresses;
  var port = server.adresses().port;

  console.log('Example app listening at http://%s:%s', host, port);  
});