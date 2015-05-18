var express = require('express');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Bcrypt = require('bcrypt');
var internals = require('./config/handlers.js');
var secret = require('./config/secret.js');
var tokenManager = require('./config/token_manager.js');

var app = express();
var port = process.env.PORT || 3000;

// Set up
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
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
router.get('/private', jwt({secret: secret.secretToken}), tokenManager.verifyToken)

app.use('/',router);
// Create a server with a host and port
var server = app.listen(port);