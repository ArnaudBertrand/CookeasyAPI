var express = require('express'),
    jwt = require('express-jwt'),
    multiparty = require('connect-multiparty'),
    ErrorHandler = require('./error').errorHandler,
    secret = require('./../config/secret.js'),
    tokenManager = require('./../config/token_manager.js'),
    recipes = require('./../handlers/recipes.js'),
    pictures = require('./../handlers/pictures.js'),
    users = require('./../handlers/users.js');

module.exports = exports = function(app) {
  var internals = {};
  internals.recipes = recipe;
  internals.pictures = new pictures();
  internals.users = new user();

  // Requires multiparty
  var multipartyMiddleware = multiparty();

  var router = express.Router();

  /** RECIPE **/
  router.route('/recipes')
      .get(internals.recipes.getRecipes)
      .post(jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipes.create);
  router.route('/recipes/:id')
      .get(internals.recipes.getRecipe)
      .delete(jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipes.remove);

  /** RECIPE -- comments **/
  router.route('/recipes/:id/comments')
      .post(jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipes.addComment);

  /** RECIPE -- pictures **/
  router.route('/recipes/:id/pictures')
      .post(jwt({secret: secret.secretToken}), tokenManager.verifyToken, multipartyMiddleware, internals.recipes.uploadPictures);

  /** USER **/
  router.route('/users/:username')
      .get(internals.users.getFromUsername)
      .put(internals.users.update);
  router.route('/users')
      .post(internals.users.signup);

  /** PICTURE **/
  router.route('/pictures')
      .post(jwt({secret: secret.secretToken}), tokenManager.verifyToken, multipartyMiddleware, internals.pictures.upload);

  /** LOGIN **/
  router.post('/login',internals.users.login);

  /** ROUTES TO CHANGE **/
  router.post('/user/login', internals.users.login); // change to Get with parameters
  /** ROUTES TO DELETE **/
  router.post('/recipe/search', internals.recipes.search); // change to Get with parameters
  router.get('/recipe/get/:id', internals.recipes.getRecipe);
  router.post('/recipe/create', jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipes.create);
  router.post('/recipe/comment/add/:id', jwt({secret: secret.secretToken}), tokenManager.verifyToken, internals.recipes.addComment);
  router.post('/user/signup', internals.users.signup);


  app.use('/',router);

  // Error handling middleware
  app.use(ErrorHandler);
};