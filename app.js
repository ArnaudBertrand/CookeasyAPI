var express = require('express'),
  morgan = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  jwt = require('express-jwt'),
  multiparty = require('connect-multiparty'),
  cloudinary = require('cloudinary'),
  secret = require('./config/secret.js'),
  tokenManager = require('./config/token_manager.js');
var internals = {};
internals.user = require('./handlers/user.js');
internals.diverse = require('./handlers/diverse.js');
internals.recipe = require('./handlers/recipe.js');

// Application environment
var app = express();
var port = process.env.PORT || 3000;

// Requires multiparty
var multipartyMiddleware = multiparty();

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
router.post('/recipe/comment/add/:id', jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipe.addComment);
router.delete('/recipe/delete/:id', jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipe.delete);
router.post('/recipe/picture/upload', jwt({secret: secret.secretToken}), tokenManager.verifyToken, multipartyMiddleware, internals.recipe.uploadPicture);

app.use('/',router);
// Create a server with a host and port
var server = app.listen(port);

// Cloudinary config - Image storing
app.configure('development', function(){
  app.use(express.errorHandler());
  cloudinary.config({ cloud_name: 'hqk7wz0oa', api_key: '418195327363955', api_secret: 'flVv33bol_ReuTE38nRZ5_zOAy0' });
});

app.locals.api_key = cloudinary.config().api_key;
app.locals.cloud_name = cloudinary.config().cloud_name;
