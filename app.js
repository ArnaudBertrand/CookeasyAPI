var express = require('express'),
  morgan = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  jwt = require('express-jwt'),
  multiparty = require('connect-multiparty'),
  secret = require('./config/secret.js'),
  tokenManager = require('./config/token_manager.js');
var internals = {};
internals.diverse = require('./handlers/diverse.js');
internals.recipe = require('./handlers/recipe.js');
internals.picture = require('./handlers/picture.js');
internals.user = require('./handlers/user.js');

// Application environment
var app = express();
var port = process.env.PORT || 3000;

// Requires multiparty
var multipartyMiddleware = multiparty();

// Set up
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "PUT, GET, POST, DELETE, OPTIONS");
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
router.get('/recipe/getTrends', internals.recipe.getTrends);
router.post('/recipe/search', internals.recipe.search);
router.post('/user/login', internals.user.login);
router.post('/user/signup', internals.user.signup);
// User routes
router.get('/user/:username', internals.user.getFromUsername);
router.post('/user',internals.user.signup);
router.put('/user/:username',internals.user.update);

// Privates routes
router.post('/recipe/create', jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipe.create);
router.post('/recipe/comment/add/:id', jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipe.addComment);
router.delete('/recipe/delete/:id', jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipe.delete);
router.post('/recipe/pictures/upload/:id', jwt({secret: secret.secretToken}), tokenManager.verifyToken, multipartyMiddleware, internals.recipe.uploadPictures);
router.post('/picture/upload', jwt({secret: secret.secretToken}), tokenManager.verifyToken, multipartyMiddleware, internals.picture.upload);
app.use('/',router);
// Create a server with a host and port
var server = app.listen(port);
