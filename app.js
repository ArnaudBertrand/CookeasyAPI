var express = require('express');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var secret = require('./config/secret.js');
var tokenManager = require('./config/token_manager.js');
var internals = {};
var internals.user = require('./handlers/user.js');
var internals.diverse = require('./handlers/diverse.js');

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
router.get('/', internals.diverse.home);
router.get('/recipe/get/:id', internals.recipe.get);
router.post('/user/login', internals.user.login);
router.post('/user/signup', internals.user.signup);

// Privates routes
router.post('/recipe/create', jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipe.create);
router.get('/recipe/delete', jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipe.delete);

app.use('/',router);
// Create a server with a host and port
var server = app.listen(port);