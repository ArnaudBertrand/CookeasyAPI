var db = require('./../mongoose/mongoose.js'),
  cloudinary = require('cloudinary'),
  Recipe = db.Recipe,
  Ingredient = db.Ingredient,
  internals = {};

// Cloudinary config - Image storing
cloudinary.config({ cloud_name: 'hqk7wz0oa', api_key: '418195327363955', api_secret: 'flVv33bol_ReuTE38nRZ5_zOAy0' });

internals.addComment = function(req, res){
  var message = req.body.comment || '';
  // Check parameter
  if(typeof message !== "string"){
    return res.send({error: "Wrongs parameters types"});
  }
  if(message.length < 10 || message.length > 255){
    return res.send({error: "Message should be between 10 and 255 characters"});
  }

  // Set user
  var user = {};
  user.name = req.user.username;

  // Add comment
  Recipe.findByIdAndUpdate(req.params.id,{$push: {"comments": {author: user, message: message, date: Date.now()}}}, {safe: true, upsert: true},function(err, model){
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

internals.get = function(req,res){
  Recipe.findOne({_id: req.params.id},function(err, recipe){
    if(recipe){
      console.log(recipe);
      res.send({success: true, recipe: recipe});
    } else {
      res.send({error: "Recipe does not exist"});
    }
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

internals.uploadPicture = function(req,res){
  var file = req.files.file;
  cloudinary.uploader.upload(
    file.path,
    function(result) { res.send(result); },
    {
      crop: 'limit',
      width: 500,
      height: 500,
      tags: ['recipe,steps']
    }
  )
};

module.exports = internals;
