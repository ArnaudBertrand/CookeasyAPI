var cloudinary = require('cloudinary'),
    Validator = require('jsonschema').Validator,
    Recipe = require('./../mongoose/recipe.js'),
    Ingredient = require('./../mongoose/ingredient.js'),
    RecipeDao = require('./../dao/recipe.dao.js');

var v = new Validator();

// Cloudinary config - Image storing
cloudinary.config({ cloud_name: 'hqk7wz0oa', api_key: '418195327363955', api_secret: 'flVv33bol_ReuTE38nRZ5_zOAy0' });

function RecipeHandler(){
  this.addComment = function(req, res, next){
    var comment = req.body;

    // Set user
    comment.author = req.user.username;

    RecipeDao.addComment(req.params.id,comment,function(err,fail){
      if(err) return next(err);
      if(fail) return res.send(fail,400);
      res.send();
    });
  };

  this.create = function (req, res, next) {
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
  };

  this.delete = function(req,res){
    var user = req.user;
    var id =  req.params.id || '';
    Recipe.findOneAndRemove({_id: id, author: req.user.username}, function(err){
      if(err){
        res.send({error: err});
      }
      res.send({success: true});
    });
  };

  this.get = function(req,res){
    var id =  req.params.id || '';

    RecipeDao.get(id,function(err,fail,recipe){
      if(err) return next(err);
      if(fail) return res.send(fail,400);
      res.send(recipe);
    })
  };

  this.getTrends = function(req,res){
    var errors = {};

    var nb = req.params.nb || 15;
    if(!v.validate(nb,numberSchema)) errors.nb = 'Nb of recipe not integer';

    if(Object.keys(errors).length > 0) return res.send(errors,400);

    RecipeDao.getTrends(nb,function(err,recipes){
      if(err) return next(err);
      res.send(recipes);
    });
  };

  this.search = function(req,res){
    var search = req.body.search || '';

    if(typeof search !== "string" ||search == ''){
      return res.send("Search terms not valid", 400);
    }
    var items = search.split(' '),
        regex = '';

    items.forEach(function(e){
      regex += '(?=.*' + e + '.*)';
    });

    Recipe.find({name: {$regex: regex, $options: "i"}}, function(err, recipes){
      if(err){
        return res.send({error: err});
      }
      res.send({recipes: recipes});
    }).limit(20);
  };

  this.uploadPictures = function(req,res){
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
  };
}

// Recipe schemas
var courseSchema = {"type": "integer", "minimum": 1, "maximum": 3, "required": true},
    difficultySchema = {"type": "integer", "minimum": 1, "maximum": 5, "required": true},
    ingredientsSchema = {"type": "array", "items": {"$ref": "/ingredient"}, "required": true},
    ingredientSchema = {"type": "object", "properties": {
      "name": {"type": "string", "required": true},
      "qte": {"type": "number", "minimum": 0},
      "unit": {"type": "string"}}},
    nameSchema = {"type": "string", "required": true},
    nbPersonSchema = {"type": "integer", "minimum": 1, "required": true},
    stepsSchema = {"type": "array", "items": {"$ref": "/step"}, "required": true},
    stepSchema = {"type": "object", "properties": {
      "action": {"type": "string", "required": true},
      "number": {"type": "integer", "minimum": 0, "required": true},
      "time": {"type": "integer"},
      "picture": {"type": "string"}
    }},
    pictureSchema = {"type": "string", "required": true},
    timeSchema = {"type": "number", "minimum": 0, "required": true},
    utensilsSchema = {"type": "array", "items": {"type": "string"}};

// Search schemas
var numberSchema = {"type": "integer", "minimum": 0};

v.addSchema(ingredientSchema, '/ingredient');
v.addSchema(stepSchema, '/step');
module.exports = RecipeHandler;
