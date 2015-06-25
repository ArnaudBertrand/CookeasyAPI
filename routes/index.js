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
    internals.picture = new picture();
    internals.user = new user();

    // Requires multiparty
    var multipartyMiddleware = multiparty();

   // Routes
    var router = express.Router();
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

    // Error handling middleware
    app.use(ErrorHandler);

};