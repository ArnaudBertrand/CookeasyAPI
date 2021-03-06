var cloudinary = require('cloudinary'),
    validate = require('jsonschema').validate,
    Recipe = require('mongoose').model('Recipe');

// Cloudinary config - Image storing
cloudinary.config({ cloud_name: 'hqk7wz0oa', api_key: '418195327363955', api_secret: 'flVv33bol_ReuTE38nRZ5_zOAy0' });

var RecipeHandler = {
  addComment: addComment,
  create: create,
  get: get,
  list: list,
  remove: remove,
  uploadPictures: uploadPictures
};

function addComment(req, res, next){
  var comment = req.body;
  var recipeId = req.params.id;

  // Set user
  comment.author = req.user;

  Recipe.addComment(recipeId, comment, function(err,fail,comment){
    if(err) return next(err);
    if(fail) return res.status(404).send(fail);
    res.status(201).send(comment);
  });
}

function create(req, res, next){
  var recipe = new Recipe(req.body);

  // Check step order
  if(!recipe.checkStepOrder()) return res.status(400).send({error: {message: 'Steps are not in correct order'}});

  // Author of the recipe
  recipe.author = req.user;

  // Create the recipe
  recipe.save(function(err,recipeSaved){
    if(err) return next(err);
    res.status(201).send(recipeSaved._id);
  });
}

function get(req,res,next){
  var id =  req.params.id || '';

  Recipe.get(id,function(err,fail,recipe){
    if(err) return next(err);
    if(fail) return res.status(404).send(fail);
    res.send(recipe);
  });
}

function list(req,res,next){
  var errors = {};

  // Number of recipe validator
  var nb = req.params.nb || 15;
  if(!validate(nb,{type: "Number", "minimum": 1})) errors.nb = 'Nb of recipe not integer';

  // Filters validator
  var filter = {};
  if(req.query.match) filter.match = req.query.match;
  if(!validate(filter.match,{type: "String"})) errors.match = 'Match filter incorrect';

  if(Object.keys(errors).length > 0) return res.send(errors,400);

  Recipe.list(nb,filter,function(err,recipes){
    if(err) return next(err);
    res.send(recipes);
  });
}

function remove(req,res,next){
  var id =  req.params.id || '';

  Recipe.remove({id: id},function(err,rmv){
    if(err) return next(err);
    if(!rmv) return res.status(404).send('Recipe not found');
    res.send(recipes);
  });
}

function uploadPictures(req,res){
  var file = req.files.file;
  var id = req.params.id;
  var author = req.user.username;
  var tags = req.params.tags || [];

  // Upload
  cloudinary.uploader.upload(
      file.path,
      function(picture) {
        picture.author = author;
        picture.createdOn =  Date.now();

        Recipe.update(id,{$push: {"pictures": picture}}, {safe: true, upsert: true},function(err){
          if(err) return res.send({error: err});
          res.send({picture: picture});
        });
      },
      {
        crop: 'limit',
        width: 800,
        height: 800,
        tags: tags
      }
  );
}

module.exports = RecipeHandler;
