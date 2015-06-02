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
    res.send(model.comments);
  });
}

// Routes handlers
internals.create = function (req, res) {
  var name = req.body.name || '';
  var course = req.body.course || -1;
  var type = req.body.type || -1;
  var ingredients = req.body.ingredients || [];
  var steps = req.body.steps || [];
  var user = req.user;

  // Check parameters
  if((typeof name !== "string") || (typeof course !== "number") || (course !== parseInt(course,10)) || (typeof type !== "number") || (type !== parseInt(type,10)) || !(ingredients instanceof Array) || !(steps instanceof Array)){
    return res.send({error: "Wrongs parameters types"});
  }
  if(!user || name == '' || course == -1 || type == -1 || ingredients.length == 0 || steps.length == 0){
    return res.send({error: "Missing parameters"});
  }

  // Check ingredients
  var stop = false;
  ingredients.forEach(function(ingredient){
    var name = ingredient.name || '';
    var qte = ingredient.qte || 0;
    var unit = ingredient.unit || '';

    if(typeof name != "string" || typeof qte !== "number" || typeof unit !== "string"){
      stop = true;
      return res.send({error: "Invalid type parameters for ingredient"});
    }

    if(name == ''){
      stop = true;
      return res.send({error: "Invalid ingredient name"});
    }
    name = name.toLowerCase();
    if(!Ingredient.where({name: name}).count()){
      var ing = new Ingredient({name: name});
      ing.save(function(err){
        if(err){
          return res.send({error: err});
        }
      });
    }
  });

  // Check steps
  var stepCount = 0;
  steps.forEach(function(step){
    stepCount++;
    var action = step.action || '';
    var stepnb = step.number || 0;
    var time = step.time || 0;
    var picture = step.picture || '';

    // Check parameters
    if((typeof action !== "string")  || (typeof stepnb !== "number") || (typeof time !== "number") || (typeof picture !== "string")){
      stop = true;
      return res.send({error: "Invalid type parameters in step"});
    }
    if(action == '' || stepnb !== stepCount){
      stop = true;
      return res.send({error: "Invalid parameters in step"});
    }
  });

  // Do not save if an error occured during loops
  if(stop){
    return;
  }

  // Create the recipe
  var recipe = new Recipe({name: name, course: course, type: type, ingredients: ingredients, steps: steps, author: req.user.username});
  recipe.save(function(err){
    res.send({id: recipe._id});
  });
};

internals.delete = function(req,res){
  var user = req.user;
  Recipe.findOneAndRemove({_id: req.params.id, author: req.user.username}, function(err){
    if(err){
      res.send({error: err});
    }
    res.send({success: true});
  });
};

internals.get = function(req,res){
  Recipe.findOne({_id: req.params.id},function(err, recipe){
    if(recipe){
      res.send({success: true, recipe: recipe});
    } else {
      res.send({error: "Recipe does not exist"});
    }
  });
};

internals.search = function(req,res){
  var name = req.body.name;

  var items = name.split(' '),
    regex = '';

  items.forEach(function(e){
    regex += '(?=.*' + e + '.*)';
  });

  Recipe.find({name: {$regex: regex, $options: "i"}}, function(err, recipes){
    if(err){
      return res.send({error: err});
    }
    res.send(recipes);
  }).limit(20);
}

internals.uploadPictures = function(req,res){
  var file = req.files.file;
  var id = req.body.recipeId;
  console.log(req.body);
  console.log("ID: " + id);

  // Upload
  cloudinary.uploader.upload(
    file.path,
    function(result) {
      // Set picture and thumbnail
      var picture = {};
      picture.url = result.url;
      picture.thumbnailUrl = cloudinary.url(result.public_id, { width: 100, height: 100, crop: "fill" });
      console.log(picture);
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
      tags: ['recipe,steps']
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
      width: 800,
      height: 800,
      tags: ['recipe,steps']
    }
  );
};

module.exports = internals;
