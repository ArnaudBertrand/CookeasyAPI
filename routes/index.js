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
  internals.recipe = recipe;
  internals.picture = new picture();
  internals.user = new user();

  // Requires multiparty
  var multipartyMiddleware = multiparty();

  var router = express.Router();

  /** RECIPE **/
  router.route('/recipes')
      .get(internals.recipe.getRecipes)
      .post(jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipe.create);
  router.route('/recipes/:id')
      .get(internals.recipe.getRecipe)
      .delete(jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipe.remove);

  /** RECIPE -- comments **/
  router.route('/recipes/:id/comments')
      .post(jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipe.addComment);

  /** RECIPE -- pictures **/
  router.route('/recipes/:id/pictures')
      .post(jwt({secret: secret.secretToken}), tokenManager.verifyToken, multipartyMiddleware, internals.recipe.uploadPictures);

  /** USER **/
  router.route('/users/:username')
      .get(internals.user.getFromUsername)
      .put(internals.user.update);
  router.route('/users')
      .post(internals.user.signup);

  /** PICTURE **/
  router.route('/pictures')
      .post(jwt({secret: secret.secretToken}), tokenManager.verifyToken, multipartyMiddleware, internals.picture.upload);

  /** LOGIN **/
  router.post('/login',internals.user.login);

  /** ROUTES TO CHANGE **/
  router.post('/user/login', internals.user.login); // change to Get with parameters
  /** ROUTES TO DELETE **/
  router.post('/recipe/search', internals.recipe.search); // change to Get with parameters
  router.get('/recipe/get/:id', internals.recipe.getRecipe);
  router.post('/recipe/create', jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipe.create);
  router.post('/recipe/comment/add/:id', jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipe.addComment);
  router.post('/user/signup', internals.user.signup);


  app.use('/',router);

  // Error handling middleware
  app.use(ErrorHandler);
};