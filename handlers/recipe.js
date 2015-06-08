var db = require('./../mongoose/mongoose.js'),
  cloudinary = require('cloudinary'),
  Recipe = db.Recipe,
  Ingredient = db.Ingredient,
  internals = {};

// Cloudinary config - Image storing
cloudinary.config({ cloud_name: 'hqk7wz0oa', api_key: '418195327363955', api_secret: 'flVv33bol_ReuTE38nRZ5_zOAy0' });

internals.addComment = function(req, res){
  var comment = {}
  comment.message = req.body.message || '';
  comment.mark = req.body.mark || 0;
  // Check parameter
  if(typeof comment.message !== "string" || typeof comment.mark !== "number"){
    return res.send({error: "Wrongs parameters types"});
  }
  if(comment.message.length < 10 || comment.message.length > 255){
    return res.send({error: "Message should be between 10 and 255 characters"});
  }
  if(comment.mark < 0 || comment.mark > 5){
    return res.send({error: "Mark should be between 0 and 5"});
  } else if(comment.mark == 0){
    delete comment.mark;
  }

  // Set user
  comment.author = req.user.username;
  // Add date
  comment.date = Date.now();

  // Add comment
  Recipe.findByIdAndUpdate(req.params.id,{$push: {"comments": comment}}, {safe: true, upsert: true},function(err, model){
    if(err){
      return res.send({error: err});
    }
    res.send({comment: comment});
  });
}

// Routes handlers
internals.create = function (req, res) {
  var errors = [];
  var recipe = {};

  //  Course type
  recipe.course = req.body.course || 0;
  if([1,2,3].indexOf(recipe.course) > -1){
    errors.push("Course should be: 1=Starter, 2=Main, 3=Dessert");
  }

  // Difficulty of the recipe
  recipe.difficulty = req.body.difficulty || 0;
  if([1,2,3,4,5].indexOf(recipe.difficulty) > -1){
    errors.push("Difficulty should be number between 1 and 5");
  }

  // Ingredients
  recipe.ingredients = req.body.ingredients || '';
  if(!(recipe.ingredients instanceof Array) || recipe.ingredients.length === 0){
    errors.push('Please insert ingredients in your recipe');
  } else {
    recipe.ingredients.forEach(function(ingredient){
      // Name
      var name = ingredient.name;
      if(typeof name !== "string" || name.length < 2){
        return errors.push("Invalid ingredient name");
      } else {
        // Add the ingredient to the ingredient list if it doesn't exist
        name = name.toLowerCase();
        if(!Ingredient.where({name: name}).count()){
          var ing = new Ingredient({name: name});
          ing.save(function(err){
            if(err){
              return res.send({error: err});
            }
          });
        }
      }
      // Quantity
      var qte = ingredient.qte;
      if(typeof qte !== 'number' || qte < 0){
        return errors.push("Invalid ingredient quantity");
      }
      // Unit
      var unit = ingredient.unit;
      if(typeof unit !== "string" || unit == ''){
        return errors.push("Invalid ingredient name");
      }
    });
  }

  // Name of the recipe
  recipe.name = req.body.name;
  if(typeof recipe.name !== "string" || recipe.name.length < 5){
    errors.push("Name is a string with at least 5 chars");
  }

  // Number of person
  recipe.nbPerson = req.body.nbPerson;
  if(!(typeof recipe.nbPerson==='number' && (recipe.nbPerson%1)===0) || recipe.nbPerson < 0){
    errors.push("Number of person should be a positive number");
  }

  // Steps
  recipe.steps = req.body.steps || '';
  if(!(recipe.steps instanceof Array) || recipe.steps.length === 0){
    errors.push('No steps in your recipe');
  } else {
    var stepCount = 0;
    recipe.steps.forEach(function(step){
      stepCount++;
      // Action
      var action = step.action || '';
      if(typeof action !== "string" || action.length < 10){
        errors.push('Actions steps should be at least 10 characters long');
      }
      // Step number
      var stepnb = step.number || 0;
      if(stepnb !== stepCount){
        error.push('Steps not in correct order');
      }
      // Time
      var time = step.time;
      if(typeof time !== undefined && (typeof time !== "number" || time < 0)){
        error.push('Step time should be a number');
      }
      // Picture
      var picture = step.picture || {};
      if(typeof picture.url !== "string" || typeof picture.thumbUrl !== "string"){
        error.push('Picture format: {thumbUrl: __, url: __}');
      }
    });
  }

  // Recipe picture
  recipe.picture = req.body.picture || {};
  if(typeof recipe.picture.url !== "string" || typeof recipe.picture.thumbUrl !== "string"){
    errors.push('Picture format: {thumbUrl: __, url: __}');
  }

  // Author of the recipe
  var user = req.user;

  // Utensils
  recipe.utensils = req.body.utensils || [];
  if(recipe.utensil instanceof Array){
    recipe.utensils.forEach(function(utensil){
      if(typeof utensil !== "string"){
        errors.push('Uncorrect utensil');
      }
    });
  } else {
    errors.push('Utensils should be array');
  }

  // Check for errors
  if(errors.length){
    return res.send(errors,400);
  }

  // Add creation date
  recipe.createdOn = Date.now();

  // Create the recipe
  var recipe = new Recipe(recipe);
  recipe.save(function(err){
    res.send({id: recipe._id});
  });
};

internals.delete = function(req,res){
  var user = req.user;
  var id =  req.params.id || '';
  Recipe.findOneAndRemove({_id: id, author: req.user.username}, function(err){
    if(err){
      res.send({error: err});
    }
    res.send({success: true});
  });
};

internals.get = function(req,res){
  var id =  req.params.id || '';
  Recipe.findOne({_id: id},function(err, recipe){
    if(recipe){
      res.send({recipe: recipe});
    } else {
      res.send({error: "Recipe does not exist"});
    }
  });
};

internals.search = function(req,res){
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
}

internals.uploadPictures = function(req,res){
  var file = req.files.file;
  var id = req.params.id;
  var author = req.user.username;

  // Upload
  cloudinary.uploader.upload(
    file.path,
    function(result) {
      // Set picture and thumbnail
      var picture = {};
      picture.url = result.url;
      picture.thumbUrl = cloudinary.url(result.public_id, { width: 100, height: 100, crop: "fill" });
      picture.author = author;

      Recipe.findByIdAndUpdate(id,{$push: {"pictures": picture}}, {safe: true, upsert: true},function(err, model){
        if(err){
          return res.send({error: err});
        }
        res.send(result.url);
      });
    },
    {
      crop: 'limit',
      width: 800,
      height: 800,
      tags: ['recipe','steps',id]
    }
  )
};

internals.uploadStepPicture = function(req,res){
  var file = req.files.file;
  cloudinary.uploader.upload(
    file.path,
    function(result) { res.send(result.url); },
    {
      crop: 'limit',
      width: 500,
      height: 500,
      tags: ['recipe,steps']
    }
  );
};

module.exports = internals;
