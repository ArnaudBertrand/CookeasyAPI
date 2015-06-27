var express = require('express'),
    jwt = require('express-jwt'),
    multiparty = require('connect-multiparty'),
    ErrorHandler = require('./error').errorHandler,
    secret = require('./../config/secret.js'),
    tokenManager = require('./../config/token_manager.js'),
    recipe = require('./../handlers/recipe.js'),
    picture = require('./../handlers/picture.js'),
    user = require('./../handlers/user.js');

module.exports = exports = function(app) {
  var internals = {};
  internals.recipe = new recipe();
  internals.picture = picture;
  internals.user = new user();

  // Requires multiparty
  var multipartyMiddleware = multiparty();

  var router = express.Router();

  /** RECIPE **/
  router.get('/recipe/:id', internals.recipe.getRecipe);
  router.get('/recipe', internals.recipe.getRecipes);
  router.post('/recipe', jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipe.create);
  router.delete('/recipe/:id', jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipe.remove);
  // Recipe -- comments
  router.post('/recipe/comment/:id', jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipe.addComment);
  // Recipe -- user pictures
  router.post('/recipe/pictures/:id', jwt({secret: secret.secretToken}), tokenManager.verifyToken, multipartyMiddleware, internals.recipe.uploadPictures);

  /** USER **/
  router.get('/user/:username', internals.user.getFromUsername);
  router.post('/user',internals.user.signup);
  router.put('/user/:username',internals.user.update);

  /** PICTURE **/
  router.post('/picture', jwt({secret: secret.secretToken}), tokenManager.verifyToken, multipartyMiddleware, internals.picture.upload);

  /** ROUTES TO CHANGE **/
  router.post('/recipe/search', internals.recipe.search); // change to Get with parameters
  router.post('/user/login', internals.user.login); // change to Get with parameters
  /** ROUTES TO DELETE **/
  router.get('/recipe/getTrends', internals.recipe.getRecipes);
  router.get('/recipe/get/:id', internals.recipe.get);
  router.post('/recipe/create', jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipe.create);
  router.post('/recipe/comment/add/:id', jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipe.addComment);
  router.post('/user/signup', internals.user.signup);


  app.use('/',router);

  // Error handling middleware
  app.use(ErrorHandler);
};