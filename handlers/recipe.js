var cloudinary = require('cloudinary'),
    validate = require('jsonschema').validate,
    Recipe = require('./../mongoose/recipe.js'),
    Ingredient = require('./../mongoose/ingredient.js'),
    RecipeDao = require('./../dao/recipe.dao.js');

// Cloudinary config - Image storing
cloudinary.config({ cloud_name: 'hqk7wz0oa', api_key: '418195327363955', api_secret: 'flVv33bol_ReuTE38nRZ5_zOAy0' });

var RecipeHandler = {
  addComment: addComment,
  create: create,
  getRecipe: getRecipe,
  getRecipes: getRecipes,
  remove: remove,
  search: search,
  uploadPictures: uploadPictures
};

function addComment (req, res, next){
  var comment = req.body;

  // Set user
  comment.author = req.user.username;

  RecipeDao.addComment(req.params.id,comment,function(err,fail,comment){
    if(err) return next(err);
    if(fail) return res.send(fail,400);
    res.send(comment);
  });
}

function create(req, res, next){
  var recipe = req.body;

  // Check step order
  recipe.steps = req.body.steps || '';
  var stepCount = 0;
  recipe.steps.forEach(function(step){
    stepCount++;
    // Step number
    var stepnb = step.number || 0;
    if(stepnb !== stepCount){
      errors.push('Steps not a number or not in correct order');
    }
  });

  // Author of the recipe
  recipe.author = req.user.username;

  // Create the recipe
  RecipeDao.create(recipe,function(err,rcpId){
    if(err) return next(err);
    res.send(rcpId);
  });
}

function getRecipe(req,res,next){
  console.log('handler single');
  var id =  req.params.id || '';

  RecipeDao.getRecipe(id,function(err,fail,recipe){
    if(err) return next(err);
    if(fail) return res.send(fail,400);
    res.send(recipe);
  })
}

function getRecipes(req,res,next){
  var errors = {};

  // Number of recipe validator
  var nb = req.params.nb || 15;
  if(!validate(nb,{type: "Number", "minimum": 1})) errors.nb = 'Nb of recipe not integer';

  // Filters validator
  var filter = {};
  if(req.query.match) filter.match = req.query.match;

  if(Object.keys(errors).length > 0) return res.send(errors,400);

  RecipeDao.getRecipes(nb,filter,function(err,recipes){
    if(err) return next(err);
    res.send(recipes);
  });
}

function remove(req,res,next){
  next({error: 'Not implemented'});
}

function uploadPictures(req,res){
  var file = req.files.file;
  var id = req.params.id;
  var author = req.user.username;
  var tags = req.params.tags || [];

  // Upload
  cloudinary.uploader.upload(
      file.path,
      function(result) {
        // Set picture and thumbnail
        var picture = {};
        picture.url = result.url;
        // Mini
        picture.miniThumbUrlLarge = cloudinary.url(result.public_id, { width: 180, height: 120, crop: "fill" });
        picture.miniThumbUrlSquare = cloudinary.url(result.public_id, { width: 100, height: 100, crop: "fill" });
        picture.miniThumbUrlLong = cloudinary.url(result.public_id, { width: 120, height: 180, crop: "fill" });
        // Thumb
        picture.thumbUrlLarge = cloudinary.url(result.public_id, { width: 300, height: 200, crop: "fill" });
        picture.thumbUrlSquare = cloudinary.url(result.public_id, { width: 300, height: 300, crop: "fill" });
        picture.thumbUrlLong = cloudinary.url(result.public_id, { width: 200, height: 300, crop: "fill" });
        picture.author = author;
        picture.createdOn =  Date.now();


        Recipe.findByIdAndUpdate(id,{$push: {"pictures": picture}}, {safe: true, upsert: true},function(err, model){
          if(err){
            return res.send({error: err});
          }
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

/******* TO REMOVE *********/
function search(req,res,next){
  var search = req.body.search || '';
  req.body.filter = {match: search};
  getRecipes(req,res,next);
}

module.exports = RecipeHandler;
